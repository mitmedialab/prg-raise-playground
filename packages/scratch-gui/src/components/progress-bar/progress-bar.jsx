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
            "At least five examples per text classifier class": false,
            "Text classifier classes are balanced": false,
            "Using embedded conditionals": false,
            "At least two text classification blocks": false,
            "Good use of image classification blocks": false,
            "Two image classifier classes": false,
            "Two text classifier classes": false,
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

        if (check === "Two text classifier classes") {
            newCompliment = {...newCompliment, "Three or more text classifier classes" : false };
        } else if (check === "Three or more text classifier classes") {
            delete newCompliment["Two text classifier classes"];
        } else if (check === "Two image classifier classes") {
            newCompliment = {...newCompliment, "Three or more image classifier classes" : false };
        } else if (check === "Three or more image classifier classes") {
            delete newCompliment["Two image classifier classes"];
        }

        this.setState({compliments: newCompliment});
    }

    calculatePercentage () {
        let keys = this.props.children[1].classifierData;
        let imageKeys = this.props.children[1].imageData;
        let blocks_used = this.props.children[3].targets[1].blocks._blocks;

        if (this.state.percentage === 100) return;
        
        this.numberOfClasses(keys, imageKeys);
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

    numberOfClasses (keys, imageKeys) {
        keys = Object.keys(keys);

        if (keys.length == 2) {
            this.setState(prevState => ({ percentage: prevState.percentage + 10 }));
            this.setState({ 
                improvements: this.state.improvements.push("You have two text classifier classes so far. Try to see if you can add more.")
            });
            this.handleListUpdate("Two text classifier classes");
        } else if (keys.length > 2) {
            this.setState(prevState => ({ percentage: prevState.percentage + 20 }));
            this.handleListUpdate("Three or more text classifier classes");
        } else {
            this.setState({ 
                improvements: this.state.improvements.push("Try adding some text classifier classes with the 'Edit Model' button to increase your progress.")
            });
        }

        if (imageKeys.length == 2) {
            this.setState(prevState => ({ percentage: prevState.percentage + 10 }));
            this.setState({ 
                improvements: this.state.improvements.push("You have two image classifier classes so far. Try to see if you can add more.")
            });
            this.handleListUpdate("Two image classifier classes");
        } else if (imageKeys.length > 2) {
            this.setState(prevState => ({ percentage: prevState.percentage + 20 }));
            this.handleListUpdate("Three or more image classifier classes");
        } else {
            this.setState({ 
                improvements: this.state.improvements.push("Try adding some classes in Teachable Machine to increase your progress.")
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
            if (this.state.percentage - 15 <= 0) {
                this.setState({ percentage: 0 });
            } else {
                this.setState(prevState => ({ percentage: prevState.percentage - 15 }));
            }
            this.setState({ 
                improvements: this.state.improvements.push("You need at least 5 examples per class to have an accurate classifier.")
            });
        } else if (Object.keys(keys).length > 0) {
            this.handleListUpdate("At least five examples per text classifier class");
            this.setState(prevState => ({ percentage: prevState.percentage + 15 }));
        }
    }

    balancedClasses (keys) {
        let classNumbers = []
        let minimum = false;
        for (let label in keys) {
            let count = 0;
            for (let example in keys[label]) {
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
                    this.setState({ percentage: 0 });
                } else {
                    this.setState(prevState => ({ percentage: prevState.percentage - 10 }));
                }
                this.setState({ 
                    improvements: this.state.improvements.push("Try making the number of examples per class be the same.")
                });
            } else {
                if (minimum === false) {
                    this.setState(prevState => ({ percentage: prevState.percentage + 10 }));
                    this.handleListUpdate("Text classifier classes are balanced");
                }
                // this.setState({ 
                //     compliments: this.state.compliments.push("Your examples in your classes are balanced well. ")
                // });
            }
        }
    }

    analyzeBlocks (blocks) {
        let count = 0;
        let parent = '';
        let sensing = 0;
        let answer = 0;
        let teachable_machine = 0;

        // go through all of the blocks
        for (let block in blocks) {
            if (blocks[block].opcode.includes('textClassification')) {
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

            if (blocks[block].opcode.includes("teachableMachine")) {
                teachable_machine = teachable_machine + 1;
            }
        }

        // check if sensing and answer matches
        if (sensing !== answer) {
            this.setState(prevState => ({ percentage: prevState.percentage - 15 }));
            this.setState({ 
                improvements: this.state.improvements.push("It seems like you're not using the same answer and asking blocks.")
            });
        }

        // check if there is an embedded
        for (let block in blocks) {
            if (blocks[block].opcode.includes('control_if')) {
                if (blocks[block].parent == parent) {
                    // this.setState({ 
                    //     compliments: this.state.compliments.push("Having embedded conditionals makes your code more complex.")
                    // });
                    this.handleListUpdate("Using embedded conditionals");
                    this.setState(prevState => ({ percentage: prevState.percentage + 15 }));
                    
                }
            }
        }

        // if 

        // if not an embedded
        if (parent == '') {
            this.setState({ 
                improvements: this.state.improvements.push("Try embeddeding conditionals to make your code more complex.")
            });
        }

        // if using teachable machine
        if (teachable_machine > 0) {
            this.setState(prevState => ({ percentage: prevState.percentage + 10 }));
            this.handleListUpdate("Good use of image classification blocks");
            // this.setState({ 
            //     compliments: this.state.compliments.push("You know how to use teachable machine blocks in your code really well.")
            // });
        }
        
        // check how many text classification blocks there are
        if (count >= 2) {
            this.setState(prevState => ({ percentage: prevState.percentage + 10 }));
            this.handleListUpdate("At least two text classification blocks");
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