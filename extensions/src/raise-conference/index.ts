import { scratch, extension, type ExtensionMenuDisplayDetails, type BlockUtilityWithID, type Environment } from "$common";

/** 👋 Hi!

Below is a working Extension that you should adapt to fit your needs. 

It makes use of JSDoc comments (anything inside of the '/**   * /' regions) 
to add explanations to what you're seeing. These do not affect the code 
and can be deleted whenever you no longer need them.

Anywhere you find something that looks like: @see {ExplanationOfSomething} 
hover over the 'ExplanationOfSomething' part (the text inside of the {...} curly brackets) 
to get a popup that tells you more about that concept.

Try out hovering by reviewing the below terminology.
NOTE: When the documentation refers to these terms, they will be capitalized.

@see {Extension}
@see {Block}
@see {BlockProgrammingEnvironment}

If you don't see anything when hovering, or find some documentation is missing, please contact: 
Parker Malachowsky (pmalacho@media.mit.edu)

Happy coding! 👋 */

/** @see {ExplanationOfDetails} */
const details: ExtensionMenuDisplayDetails = {
  name: "RAISE Conference",
  description: "Replace me with a description of your extension",
  iconURL: "Replace with the name of your icon image file (which should be placed in the same directory as this file)",
  insetIconURL: "Replace with the name of your inset icon image file (which should be placed in the same directory as this file)"
};

/** @see {ExplanationOfClass} */
export default class ExtensionNameGoesHere extends extension(details, "ui") {

  password: string;
  challengePassed;


  stage;
  env;
  currentTarget;
  passwordMap;
  level;

  sizeMap;
  aliceSprite;
  handSprite;

  /** @see {ExplanationOfInitMethod} */
  init(env: Environment) {
    this.challengePassed = false;
    this.exampleField = 0;
    this.password = "";
    this.env = env;
    this.currentTarget = this.env.runtime._editingTarget;

    console.log(env.runtime);

    this.passwordMap = {
      "storyTime": "growingAlien",
      "growingAlien": "dancingSprite",
      "dancingSprite": "detectSmile",
      "detectSmile": "followHand",
      "followHand": "textClassification",
      "textClassification": "You finished!",
    }

    const url = new URL(window.location.href); // Or use any URL string
    const params = new URLSearchParams(url.search);
    console.log("params", params.get('level'));
    const level = params.get('level');
    this.level = level;
    this.openUI("Level");

    this.sizeMap = {};

    
    env.runtime.on('PROJECT_RUN_STOP', () => {
      if (level == "storyTime") {
        if (this.storyTime()) {
          this.challengePassed = true;
        }
      }
      if (level == "textClassification") {
        if (this.textClassification()) {
          this.challengePassed = true;
        }
      }
      if (level == "growingAlien") {
        if (this.aliceSprite) {
          const newSize = this.aliceSprite.size;
          const prevSize = this.sizeMap[this.aliceSprite.sprite.name];
          if ((newSize - prevSize) == 100 && this.aliceInWonderland()) {
            this.challengePassed = true;
          } 
        }
      }
    })

    env.runtime.on('PROJECT_RUN_START', () => {
      this.populateSizeArray();
      this.aliceInWonderland();
      if (level == "dancingSprite") {
        if (this.dancingSprite()) {
          this.challengePassed = true;
        }
      }
    })

    for (const target of env.runtime.targets) {
      if (target.isStage) {
        this.stage = target;
      }
    }

  }

  /** @see {ExplanationOfField} */
  exampleField: number;

  

  


  /** @see {ExplanationOfExampleReporter}*/
  @(scratch.reporter`Show password`)
  showPassword(utility: BlockUtilityWithID) {
    const position = this.getPosition(utility);
    if (this.level == "detectSmile") {
      if (this.detectSmile()) {
        return this.passwordMap[this.level];
      } else {
        return "NO";
      }
    } else if (this.level == "followHand") {
      if (this.followHand()) {
        console.log(position[0], position[1]);
        if (position[0] > 150 && position[1] > 100) {
          return this.passwordMap[this.level];
        } else {
          return "NO";
        }
      } else {
        return "NO";
      }
    } else {
      if (this.challengePassed) {
        return this.passwordMap[this.level];
      } else {
        return "NO";
      }
    }
    
  }

  @(scratch.button`Go To Next Level!`)
  levelInformation() {
    this.openUI("Password");
  }

  @(scratch.button`Get Level Information`)
  nextLevel() {
    this.openUI("Level");
  }







  // LEVEL FUNCTIONS

  storyTime() {
    // const validFirst = [
    //   ['event_whenflagclicked', 'looks_say', 'control_wait', 'looks_say', 'control_wait'],
    //   ['event_whenflagclicked', 'looks_say', 'control_wait', 'looks_sayforsecs', 'control_wait'],
    //   ['event_whenflagclicked', 'looks_sayforsecs', 'control_wait', 'looks_say', 'control_wait'],
    //   ['event_whenflagclicked', 'looks_sayforsecs', 'control_wait', 'looks_sayforsecs', 'control_wait'],

      
    //   // ['event_whenflagclicked', 'looks_sayforsecs', 'looks_sayforsecs'],
    //   // ['event_whenflagclicked', 'looks_say', 'control_wait', 'looks_say', 'control_wait'],
    // ];
    const validFirst = [
      ['event_whenflagclicked', 'looks_say', 'control_wait'],
      ['event_whenflagclicked', 'looks_say'],
      ['event_whenflagclicked', 'looks_sayforsecs'],
      ['event_whenflagclicked', 'looks_sayforsecs', 'control_wait'],
    ];
    // const validSecond = [
    //   ['event_whenflagclicked', 'control_wait', 'looks_say', 'control_wait' , 'looks_say'],
    //   ['event_whenflagclicked', 'control_wait', 'looks_say', 'control_wait' , 'looks_sayforsecs'],
    //   ['event_whenflagclicked', 'control_wait', 'looks_sayforsecs', 'control_wait'  , 'looks_say'],
    //   ['event_whenflagclicked', 'control_wait', 'looks_sayforsecs', 'control_wait' , 'looks_sayforsecs'],
    // ];

    const validSecond = [
      ['event_whenflagclicked', 'control_wait', 'looks_say'],
      ['event_whenflagclicked', 'control_wait', 'looks_sayforsecs'],
    ];
    const targets = this.getTargets();
    const conditionsMet = {
      "one": false,
      "two": false
    }
    console.log(targets);
    for (const target of targets) {
      const name = target.sprite.name;
      if (name != "Stage") {
        console.log(target.sprite.name);
        const stacks = this.detectStacks(target);
        const firstMet = stacks.length > 0 ? this.hasCommonArray(stacks, validFirst) : false;
        const secondMet = stacks.length > 0 ? this.hasCommonArray(stacks, validSecond) : false;
        conditionsMet.one = conditionsMet.one ? true : firstMet ? (firstMet && secondMet ? false : true) : false;
        conditionsMet.two = conditionsMet.two ? true : secondMet ? (firstMet && secondMet ? false : true) : false;
      }
    }
    console.log(conditionsMet);
    return conditionsMet.one && conditionsMet.two;
  }


  aliceInWonderland() {
    const previousSize = [
      ['event_whenflagclicked', 'control_repeat', 'looks_changesizeby'],
      ['control_repeat', 'looks_changesizeby'],
      ['event_whenflagclicked', 'control_repeat_until', 'looks_changesizeby'],
      ['control_repeat_until', 'looks_changesizeby']
    ]
    let conditionMet = false;
    const targets = this.getTargets();
    for (const target of targets) {
      const name = target.sprite.name;
      if (name != "Stage") {
        console.log(target.sprite.name);
        const stacks = this.detectStacks(target);
        conditionMet = stacks.length > 0 ? this.hasCommonArray(stacks, previousSize) : false;
        if (conditionMet) {
          this.aliceSprite = target;
        }
      }
    }
    return conditionMet;
  }

  dancingSprite() {
    const validBlocks = [
      ['event_whenflagclicked', 'sound_play', 'control_forever', "control_wait", "looks_nextcostume"],
      ['sound_play', 'control_forever', "control_wait", "looks_nextcostume"],
      ['event_whenflagclicked', 'sound_play', 'control_forever', "looks_nextcostume", "control_wait"],
      ['sound_play', 'control_forever', "looks_nextcostume", "control_wait"],
      ['event_whenflagclicked', 'sound_play', 'control_repeat', "control_wait", "looks_nextcostume"],
      ['sound_play', 'control_repeat', "control_wait", "looks_nextcostume"],
      ['event_whenflagclicked', 'sound_play', 'control_repeat', "looks_nextcostume", "control_wait"],
      ['sound_play', 'control_repeat', "looks_nextcostume", "control_wait"],
      
    ];
    const targets = this.getTargets();
    let conditionMet = false;
    for (const target of targets) {
      const name = target.sprite.name;
      if (name != "Stage") {
        console.log(target.sprite.name);
        const stacks = this.detectStacks(target);
        const blocksMet = stacks.length > 0 ? this.hasCommonArray(stacks, validBlocks) : false;
        const costumeMet = this.getCostumeLength(target) > 1;
        console.log(blocksMet, costumeMet);
        conditionMet = blocksMet && costumeMet;
      }
    }
    return conditionMet;
  }

  followHand() {
    const noseBlocks = [
      ['event_whenflagclicked', 'control_forever', "control_wait", 'poseHand_goToHandPart'],
      ['event_whenflagclicked', 'control_forever', 'poseHand_goToHandPart', "control_wait"],
      ['event_whenflagclicked', 'control_forever', 'poseHand_goToHandPart'],
      ['control_forever', 'poseHand_goToHandPart'],
      ['control_forever', 'poseHand_goToHandPart', "control_wait"],
      ['control_forever', "control_wait", 'poseHand_goToHandPart']
    ]
    const targets = this.getTargets();
    let conditionMet = false;
    for (const target of targets) {
      const name = target.sprite.name;
      if (name != "Stage") {
        console.log(target.sprite.name);
        const stacks = this.detectStacks(target);
        const blocksMet = stacks.length > 0 ? this.hasCommonArray(stacks, noseBlocks) : false;
        conditionMet = blocksMet;
      }
    }
    return conditionMet;
  }

  
  detectSmile() {
    const faceBlocks = [
      ['poseFace_affdexWhenExpression', 'looks_sayforsecs']
    ];
    const targets = this.getTargets();
    let conditionMet = false;
    for (const target of targets) {
      const name = target.sprite.name;
      if (name != "Stage") {
        console.log(target.sprite.name);
        const stacks = this.detectStacks(target);
        const blocksMet = stacks.length > 0 ? this.hasCommonArray(stacks, faceBlocks) : false;
        conditionMet = blocksMet;
      }
    }
    return conditionMet;
  }

  textClassification() {
    const textStacks = [
      ['sensing_askandwait', 'control_if', "id", "looks_sayforsecs"],
      ['event_whenflagclicked', 'sensing_askandwait', 'control_if', "id", "looks_sayforsecs"],
      ['sensing_askandwait', 'control_if_else', "id", "looks_sayforsecs"],
      ['event_whenflagclicked', 'sensing_askandwait', 'control_if_else', "id", "looks_sayforsecs"],
    ]
    const targets = this.getTargets();
    let conditionMet = false;
    for (const target of targets) {
      const name = target.sprite.name;
      if (name != "Stage") {
        console.log(target.sprite.name);
        const stacks = this.detectStacks(target);
        const blocksMet = stacks.length > 0 ? this.hasCommonArray(stacks, textStacks) : false;
        const metStack = blocksMet ? stacks[this.getCommonArray(stacks, textStacks)] : [];
        console.log(metStack);
        const ifId = metStack.find((value) => value.includes("id---"));
        console.log(ifId);
        const idMet = ifId ? this.getIfCondition(ifId.replace(/^id---/, ""), this.getBlocks(target)) : false;
        conditionMet = blocksMet && idMet;
      }
    }
    return conditionMet;
  }




  // UTILITY FUNCTIONS

  getBlocks(target) {
    return target.blocks._blocks;
  }

  detectStacks(target) {
    const stacks = [];
    const scripts = target.blocks._scripts;
    const blocks = target.blocks._blocks;
    console.log("blocks", blocks);
    for (const script of scripts) {
      const currentStack = [];
      let block = blocks[script];
      currentStack.push(block.opcode);
      if (block.opcode == "control_forever" || block.opcode == "control_repeat") {
        let nextBlock = block.inputs.SUBSTACK ? block.inputs.SUBSTACK.block : null;
        block.next = nextBlock;
      }
      while (block.next) {
        block = blocks[block.next];
        currentStack.push(block.opcode);
        if (block.opcode == "control_if" || block.opcode == "control_if_else") {
          currentStack.push(`id---${block.id}`);
          let nextBlock = block.inputs.SUBSTACK ? block.inputs.SUBSTACK.block : null;
          block.next = nextBlock;
        }
        if (block.opcode == "control_forever" || block.opcode == "control_repeat") {
          let nextBlock = block.inputs.SUBSTACK ? block.inputs.SUBSTACK.block : null;
          block.next = nextBlock;
        }
      }
      stacks.push(currentStack);
    }
    console.log("ALL STACKS", stacks);
    return stacks;
  }

  getIfCondition(blockId, blocks) {
    const block = blocks[blockId];
    let inputBlock = block.inputs.CONDITION.block;
    inputBlock = inputBlock ? blocks[inputBlock] : null;

    let operand1;
    let operand2;
    let operand1condition = false;
    let operand2condition = false;

    console.log(inputBlock);
    console.log(inputBlock.inputs);
    console.log(inputBlock.inputs.OPERAND1);

    if (inputBlock && inputBlock.opcode == "operator_gt") {
      operand1 = inputBlock.inputs['OPERAND1'].block;
      console.log(operand1);
      operand1 = operand1 ? blocks[operand1] : null;
      console.log(operand1);
      operand2 = inputBlock.inputs['OPERAND2'].block;
      console.log(operand2);
      operand2 = operand2 ? blocks[operand2] : null;
      console.log(operand2);
      console.log("one");
    } else if (inputBlock && inputBlock.opcode == "operator_lt") {
      operand1 = inputBlock.inputs['OPERAND2'].block;
      operand1 = operand1 ? blocks[operand1] : null;
      operand2 = inputBlock.inputs['OPERAND1'].block;
      operand2 = operand2 ? blocks[operand2] : null;
    }
    console.log(operand1, operand2);
      
    if (operand1 && operand1.opcode == "textClassification_sentimentScore") {
      console.log("passed 1");
      let answerBlock = operand1.inputs.TEXT.block;
      answerBlock = answerBlock ? blocks[answerBlock] : null;
      if (answerBlock && answerBlock.opcode == "sensing_answer") {
        console.log("passed 2");
        operand1condition = true;
      }
    }
    if (operand2 && operand2.opcode == "text") {
      console.log("passed 3");
      if (operand2.fields.TEXT.value == "0") {
        console.log("passed 4");
        operand2condition = true;
      }
    }
    console.log("operand1", operand1condition, "operand2", operand2condition)
    return operand1condition && operand2condition;
   
  }
  

  getCostumeLength(target) {
    const costumes = target.sprite.costumes;
    return costumes.length;
  }

  getPosition(utility: BlockUtilityWithID) {
    return [utility.thread.target.x, utility.thread.target.y];
  }

  getTargets() {
    return this.env.runtime.targets;
  }

  arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        if (a[i] == "id" && b[i].includes("id---")) {

        } else if (b[i] == "id" && a[i].includes("id---")) {

        } else {
          return false;
        }
      }
    }
    return true;
  }

  hasCommonArray(arr2D1, arr2D2) {
    console.log(arr2D1);
    for (let i = 0; i < arr2D1.length; i++) {
      for (let j = 0; j < arr2D2.length; j++) {
        if (this.arraysEqual(arr2D1[i], arr2D2[j])) {
          return true;
        }
      }
    }
    return false;
  }

  getCommonArray(arr2D1, arr2D2) {
    console.log(arr2D1);
    for (let i = 0; i < arr2D1.length; i++) {
      for (let j = 0; j < arr2D2.length; j++) {
        if (this.arraysEqual(arr2D1[i], arr2D2[j])) {
          return i;
        }
      }
    }
    return false;
  }

  populateSizeArray() {
    const targets = this.getTargets();
    for (const target of targets) {
      const name = target.sprite.name;
      const size = target.size;
      this.sizeMap[name] = size;
    }
  }
  



}