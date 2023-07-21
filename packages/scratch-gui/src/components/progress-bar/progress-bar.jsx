/* eslint-disable no-negated-condition */
import React from 'react';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';
import {connect} from 'react-redux';
import Box from '../box/box.jsx';
import styles from '../asset-panel/asset-panel.css';
import progress_styles from './progress-styles.css';
import VM from 'scratch-vm';

class ProgressBarExample extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        percentage: 0,
        compliments: {
            'At least five examples per text classifier class': false,
            'Text classifier classes are balanced': false,
            'Using embedded conditionals': false,
            'Using two text classification blocks': false,
            // 'Good use of image classification blocks': false,
            // 'Two image classifier classes': false,
            'Two text classifier classes': false
        },
        improvements: []
      };

      this.calculatePercentage = this.calculatePercentage.bind(this);
    }
    
    componentDidMount() {
        this.calculatePercentage();
    }

    handleListUpdate(check) {
        let newCompliment = this.state.compliments;
        newCompliment[check] = !newCompliment[check];

        if (check === 'Two text classifier classes') {
            newCompliment = {...newCompliment, 'Three or more text classifier classes' : false};

        } else if (check === 'Three or more text classifier classes') {
            delete newCompliment['Two text classifier classes'];

        } else if (check === 'Using two text classification blocks') {
            newCompliment = {...newCompliment, 'Using three text classification blocks' : false};

        } else if (check === 'Using three text classification blocks') {
            delete newCompliment['Using two text classification blocks'];
            newCompliment = {...newCompliment, 'Using at least four text classification blocks' : false};

        } else if (check === 'Using at least four text classification blocks') {
            delete newCompliment['Using two text classification blocks'];
            delete newCompliment['Using three text classification blocks'];
        }

        this.setState({compliments: newCompliment});
    }

    calculatePercentage () {
        let keys = this.props.children[1].classifierData;
        let blocks_used = this.props.children[3].targets[1].blocks._blocks;

        if (this.state.percentage === 100) return;
        
        this.numberOfClasses(keys);
        this.atLeastFive(keys);
        this.balancedClasses(keys);
        this.analyzeBlocks(blocks_used);

        this.setState({ 
            improvements: Array.from(this.state.improvements)
        });
        // this.setState({ 
        //     compliments: Array.from(this.state.compliments)
        // });
        
        return this.state.percentage;
    }

    numberOfClasses (keys) {
        keys = Object.keys(keys);

        if (keys.length === 2) {
            this.setState(prevState => ({percentage: prevState.percentage + 20}));
            this.setState({ 
                improvements: this.state.improvements.push('You have two text classifier classes so far. Try to see if you can add more.')
            });
            this.handleListUpdate('Two text classifier classes');
        } else if (keys.length > 2) {
            this.setState(prevState => ({percentage: prevState.percentage + 30}));
            this.handleListUpdate('Three or more text classifier classes');
        } else {
            this.setState({
                improvements: this.state.improvements.push('Try adding some text classifier classes with the \'Edit Model\' button to increase your progress.')
            });
        }
    }

    atLeastFive (keys) {
        let minimum = false;
        for (const label in keys) {
            if (keys[label].length < 5) {
                minimum = true;
            }
        }

        if (minimum === true) {
            if (this.state.percentage - 15 <= 0) {
                this.setState({percentage: 0});
            } else {
                this.setState(prevState => ({percentage: prevState.percentage - 15}));
            }
            this.setState({
                improvements: this.state.improvements.push('You need at least 5 examples per class to have an accurate classifier.')
            });
        } else if (Object.keys(keys).length > 0) {
            this.handleListUpdate('At least five examples per text classifier class');
            this.setState(prevState => ({percentage: prevState.percentage + 15}));
        }
    }

    balancedClasses (keys) {
        let classNumbers = [];
        let minimum = false;
        for (const label in keys) {
            let count = 0;
            for (const _ in keys[label]) {
                count = count + 1;
            }
            if (keys[label].length < 5) {
                minimum = true;
            }
            classNumbers.push(count);
        }

        classNumbers.sort();
        if (classNumbers.length > 1) {
            if (classNumbers[classNumbers.length - 1] - classNumbers[0] > 3) {
                if (this.state.percentage - 10 <= 0) {
                    this.setState({percentage: 0});
                } else {
                    this.setState(prevState => ({percentage: prevState.percentage - 10}));
                }
                this.setState({
                    improvements: this.state.improvements.push('Try making the number of examples per class be the same.')
                });
            } else {
                if (minimum === false) {
                    this.setState(prevState => ({ percentage: prevState.percentage + 10 }));
                    this.handleListUpdate('Text classifier classes are balanced');
                }
                // this.setState({
                //     compliments: this.state.compliments.push('Your examples in your classes are balanced well. ')
                // });
            }
        }
    }

    analyzeBlocks (blocks) {
        let count = 0;
        const parents = [];
        let sensing = 0;
        let answer = 0;
        let teachable_machine = 0;
        let usedEmbeddedConditionals = false;

        // go through all of the blocks
        for (const block in blocks) {
            if (blocks[block].opcode.includes('textClassification')) {
                count = count + 1;
            }
            if (blocks[block].opcode.includes('control_if')) {
                parents.push(blocks[block].id);
            }

            if (blocks[block].opcode.includes('sensing_askandwait')) {
                sensing = sensing + 1;
            }

            if (blocks[block].opcode.includes('sensing_answer')) {
                answer = answer + 1;
            }

            if (blocks[block].opcode.includes('teachableMachine')) {
                teachable_machine = teachable_machine + 1;
            }
        }

        // check if sensing and answer matches
        if (sensing !== 0 && answer === 0) {
            this.setState(prevState => ({percentage: prevState.percentage - 15}));
            this.setState({
                improvements: this.state.improvements.push("It seems like you're not using the same type of answer and asking blocks.")
            });
        }

        // check if there is an embedded
        for (const block in blocks) {
            if (blocks[block].opcode.includes('control_if')) {
                if (parents.includes(blocks[block].parent)) {
                    usedEmbeddedConditionals = true;
                }
            }
        }

        // if not an embedded
        if (!usedEmbeddedConditionals) {
            this.setState({
                improvements: this.state.improvements.push('Try embedding conditionals to make your code more complex.')
            });
        } else {
            this.handleListUpdate('Using embedded conditionals');
            this.setState(prevState => ({percentage: prevState.percentage + 15}));
        }

        // if using teachable machine
        if (teachable_machine > 0) {
            this.setState(prevState => ({percentage: prevState.percentage + 10 }));
            this.handleListUpdate('Good use of image classification blocks');
        }
        
        // check how many text classification blocks there are
        if (count === 2) {
            this.setState(prevState => ({percentage: prevState.percentage + 10}));
            this.handleListUpdate('Using two text classification blocks');
            this.setState({
                improvements: this.state.improvements.push('Try adding a variety of text classification blocks to increase your progress')
            });
        } else if (count === 3) {
            this.setState(prevState => ({percentage: prevState.percentage + 20}));
            this.handleListUpdate('Using three text classification blocks');
            this.setState({
                improvements: this.state.improvements.push('Try adding a variety of text classification blocks to increase your progress')
            });
        } else if (count > 3) {
            this.setState(prevState => ({percentage: prevState.percentage + 30}));
            this.handleListUpdate('Using at least four text classification blocks');
        } else {
            this.setState({
                improvements: this.state.improvements.push('Try adding a variety of text classification blocks to increase your progress')
            });
        }
    }


    // ICON: https://www.vexels.com/png-svg/preview/127207/blue-progress-bar-line-icon-svg
    
    render() {
      return (
        <Box className={styles.wrapper}>
          
          <div className = {progress_styles.progresslocation}>
            <div className = {progress_styles.progressBarBox}>
                <h1>AI Progress bar</h1>
                <h1>{this.state.percentage}%</h1>
                <ProgressBar percentage={this.state.percentage} />
            </div>
            <div className = {progress_styles.progressGoodMessages}>
                <div className = {progress_styles.progressBorderBox}>
                    <h3 className = {progress_styles.progressUnderline}>What You Have Done Well</h3>
                    {Object.keys(this.state.compliments).map(key => <li className={this.state.compliments[key] === true ? progress_styles.progressCompletedText : progress_styles.progressNotComplete}
                    key={key}>{key}</li> )}
                </div>
                <div className = {progress_styles.progressBorderBox}>
                    <h3 className = {progress_styles.progressUnderline}>Improvements You Can Make</h3>
                    {this.state.improvements.map((txt, index) => <li key={index}>{txt}</li> )}
                </div>
            </div>
          </div>
        </Box>
      )
    }  
  }
  
  const ProgressBar = (props) => {
    return (
        <div className= {progress_styles.progressbar}>
          <Filler percentage={props.percentage} />
        </div>
      )
  }
  
  const Filler = (props) => {
    return <div className={progress_styles.filler} style={{ width: `${props.percentage}%` }} />
  }

export default ProgressBarExample;