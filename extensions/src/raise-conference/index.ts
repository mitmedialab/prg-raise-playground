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
export default class ExtensionNameGoesHere extends extension(details) {

  password: string;
  challengePassed;


  stage;
  env;
  currentTarget;
  levelMap;
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

    this.levelMap = {
      0: "sdkkdjj",
      1: "aliceInWonderland",
      2: "kjsdkjfk",
      3: "sjksddka",
      4: "jdksldf",
      5: "jdkslsld"
    }

    const url = new URL(window.location.href); // Or use any URL string
    const params = new URLSearchParams(url.search);
    console.log("params", params.get('level'));
    const level = params.get('level');
    this.level = level;

    this.sizeMap = {};

    
    env.runtime.on('PROJECT_RUN_STOP', () => {
      if (level == "storyTime") {
        if (this.storyTime()) {
          this.challengePassed = true;
        }
      }
      if (level == "aliceInWonderland") {
        if (this.aliceSprite) {
          const newSize = this.aliceSprite.size;
          const prevSize = this.sizeMap[this.aliceSprite.sprite.name];
          if ((newSize - prevSize) == 100 && this.aliceInWonderland()) {
            this.challengePassed = true;
          } 
        }
      }
      if (level == "dancingSprite") {
        if (this.dancingSprite()) {
          this.challengePassed = true;
        }
      }
      if (level == "followHand") {
        if (this.followHand()) {
          this.challengePassed = true;
        }
      }
    })

    env.runtime.on('PROJECT_RUN_START', () => {
      this.populateSizeArray();
      this.aliceInWonderland();
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
    console.log(position);
    if (this.challengePassed) {
      if (this.level == "poseHand") {
        if (position[0] > 150 && position[1] > 150) {
          return "HEY";
        } else {
          return "NO";
        }
      }
      return "HEY";
    } else {
      return "NO";
    }
  }

  @(scratch.reporter`Get stats`)
  getStats() {
    console.log(this.currentTarget);
    this.detectStacks(this.currentTarget);
    this.storyTime();
  }







  // LEVEL FUNCTIONS

  storyTime() {
    const validFirst = [
      ['looks_sayforsecs', 'looks_sayforsecs'],
      ['looks_say', 'control_wait', 'looks_say', 'control_wait'],
      ['event_whenflagclicked', 'looks_sayforsecs', 'looks_sayforsecs'],
      ['event_whenflagclicked', 'looks_say', 'control_wait', 'looks_say', 'control_wait'],
    ];
    const validSecond = [
      ['looks_sayforsecs', 'looks_sayforsecs'],
      ['control_wait', 'looks_say', 'control_wait', 'looks_say'],
      ['event_whenflagclicked', 'looks_sayforsecs', 'looks_sayforsecs'],
      ['event_whenflagclicked', 'control_wait', 'looks_say', 'control_wait', 'looks_say'],
    ];
    const targets = this.getTargets();
    const conditionsMet = {
      "one": false,
      "two": false
    }
    for (const target of targets) {
      const name = target.sprite.name;
      if (name != "Stage") {
        console.log(target.sprite.name);
        const stacks = this.detectStacks(target);
        const firstMet = stacks.length > 0 ? this.hasCommonArray(stacks, validFirst) : false;
        const secondMet = stacks.length > 0 ? this.hasCommonArray(stacks, validSecond) : false;
        conditionsMet.one = firstMet ? (firstMet && secondMet ? false : true) : false;
        conditionsMet.two = secondMet ? (firstMet && secondMet ? false : true) : false;
      }
    }
    return conditionsMet.one && conditionsMet.two;
  }


  aliceInWonderland() {
    const previousSize = [
      ['event_whenflagclicked', 'control_repeat', 'looks_changesizeby'],
      ['control_repeat', 'looks_changesizeby']
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
      ['sound_play', 'control_forever', "control_wait", "looks_nextcostume"]
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
        conditionMet = blocksMet && costumeMet;
      }
    }
    return conditionMet;
  }

  followHand() {
    const handBlocks = [
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
        const blocksMet = stacks.length > 0 ? this.hasCommonArray(stacks, handBlocks) : false;
        conditionMet = blocksMet;
      }
    }
    return conditionMet;
  }




  // UTILITY FUNCTIONS

  detectStacks(target) {
    const stacks = [];
    const scripts = target.blocks._scripts;
    const blocks = target.blocks._blocks;
    for (const script of scripts) {
      const currentStack = [];
      let block = blocks[script];
      currentStack.push(block.opcode);
      if (block.opcode == "control_forever" || block.opcode == "control_repeat") {
        let nextBlock = block.inputs.SUBSTACK.block;
        block.next = nextBlock;
      }
      while (block.next) {
        block = blocks[block.next];
        currentStack.push(block.opcode);
        if (block.opcode == "control_forever" || block.opcode == "control_repeat") {
          let nextBlock = block.inputs.SUBSTACK.block;
          block.next = nextBlock;
        }
      }
      stacks.push(currentStack);
    }
    console.log("ALL STACKS", stacks);
    return stacks;
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
      if (a[i] !== b[i]) return false;
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

  populateSizeArray() {
    const targets = this.getTargets();
    for (const target of targets) {
      const name = target.sprite.name;
      const size = target.size;
      this.sizeMap[name] = size;
    }
  }
  



}