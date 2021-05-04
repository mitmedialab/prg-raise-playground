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
        compliments: [],
        improvements: []
      };

      this.calculatePercentage = this.calculatePercentage.bind(this);
    }
    
    componentDidMount() {
        this.calculatePercentage();
    }

    calculatePercentage () {
        let keys = this.props.children[1].classifierData;
        let blocks_used = this.props.children[3].targets[1].blocks._blocks;
        console.log(blocks_used);

        if (this.state.percentage === 100) return;
        if (this.state.percentage === 100) return;
        
        this.numberOfClasses(keys);
        this.atLeastFive(keys);
        this.balancedClasses(keys);
        this.analyzeBlocks(blocks_used);
        
        this.setState({ 
            improvements: Array.from(this.state.improvements)
        });
        this.setState({ 
            compliments: Array.from(this.state.compliments)
        });
        
        return this.state.percentage;
    }

    numberOfClasses (keys) {
        keys = Object.keys(keys);
        if (keys.length == 2) {
            this.setState(prevState => ({ percentage: prevState.percentage + 25 }));
            this.setState({ 
                improvements: this.state.improvements.push("You have two classes so far! Try to see if you can add more!")
            });
        } else if (keys.length > 2) {
            this.setState(prevState => ({ percentage: prevState.percentage + 50 }));
            this.setState({ 
                compliments: this.state.compliments.push("Wow you added so many different classes! Keep up the good work!")
            });
        } else {
            this.setState({ 
                improvements: this.state.improvements.push("Try adding some classes with the 'Edit Model' button to increase your progress!")
            });
        }
    }

    atLeastFive (keys) {
        let minimum = false;
        for (let label in keys) {
            if (keys[label].length < 5) {
                minimum = true;
            }
        }

        if (minimum === true) {
            if (this.state.percentage - 20 <= 0) {
                this.setState(prevState => ({ percentage: 0 }));
            } else {
                this.setState(prevState => ({ percentage: prevState.percentage - 20 }));
            }
            this.setState({ 
                improvements: this.state.improvements.push("You need at least 5 examples per class to have an accurate classifier!")
            });
        } else if (Object.keys(keys).length > 0) {
            this.setState({ 
                compliments: this.state.compliments.push("You have at least 5 examples per class")
            });
        }
    }

    balancedClasses (keys) {
        let classNumbers = []
        for (let label in keys) {
            let count = 0;
            for (let example in keys[label]) {
                count = count + 1;
            }
            classNumbers.push(count);
        }

        classNumbers.sort();
        if (classNumbers.length > 1) {
            if (classNumbers[classNumbers.length - 1] - classNumbers[0] > 3) {
                if (this.state.percentage - 20 <= 0) {
                    this.setState(prevState => ({ percentage: 0 }));
                } else {
                    this.setState(prevState => ({ percentage: prevState.percentage - 20 }));
                }
                this.setState({ 
                    improvements: this.state.improvements.push("Try making the number of examples per class be the same!")
                });
            }
        }
    }

    analyzeBlocks (blocks) {
        let count = 0;
        let parent = '';
        let sensing = 0;
        let answer = 0;

        // go through all of the blocks
        for (let block in blocks) {
            if (blocks[block].opcode.includes('textClassification')) {
                console.log(blocks[block].opcode);
                count = count + 1;
            }
            if (blocks[block].opcode.includes('control_if') && !blocks[block].parent) {
                parent = blocks[block].id;
            }

            if (blocks[block].opcode.includes("sensing_askandwait")) {
                sensing = sensing + 1;
            }

            if (blocks[block].opcode.includes("sensing_answer")) {
                answer = answer + 1;
            }
        }

        // check if sensing and answer matches
        if (sensing !== answer) {
            this.setState({ 
                improvements: this.state.improvements.push("It seems like you're not using the same answer and asking blocks.")
            });
        }

        // check if there is an embedded
        for (let block in blocks) {
            if (blocks[block].opcode.includes('control_if')) {
                if (blocks[block].parent == parent) {
                    this.setState({ 
                        compliments: this.state.compliments.push("Having embedded conditionals makes your code more complex.")
                    });
                }
            }
        }

        // if not an embedded
        if (parent == '') {
            this.setState({ 
                improvements: this.state.improvements.push("Try embeddeding conditionals to make your code more complex.")
            });
        }
        
        // check how many text classification blocks there are
        if (count == 2) {
            this.setState(prevState => ({ percentage: prevState.percentage + 15 }));
            this.setState({ 
                improvements: this.state.improvements.push("See if you can make your code more complex by using more text classification blocks.")
            });
        } else if (count > 2) {
            this.setState(prevState => ({ percentage: prevState.percentage + 25 }));
            this.setState({ 
                compliments: this.state.compliments.push("You know how to use text classification blocks in your code really well.")
            });
        }
    }

    
    render() {
      return (
        <Box className={styles.wrapper}>
          
          <div className = {progress_styles.progresslocation}>
          <h1>AI Progress bar</h1>
          <ProgressBar percentage={this.state.percentage} />
          </div>
          <div className = {progress_styles.progressGoodMessages}>
              <h3>Improvements You Can Make</h3>
            {this.state.improvements.map((txt, index) => <li key={index}>{txt}</li> )}
            <h3>What You Have Done Well</h3>
            {this.state.compliments.map((txt, index) => <li key={index}>{txt}</li> )}
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