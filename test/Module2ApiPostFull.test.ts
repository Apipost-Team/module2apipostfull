import { Module2ApiPostFull } from '../src/Module2ApiPostFull'
let fs = require('fs');
let path = require('path');

describe('works', () => {
  const swaggerV3Module = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/swaggerV3Module.json'), 'utf-8'));
  let result = true;
  try {
    Module2ApiPostFull(swaggerV3Module)
    // console.log(Module2ApiPostFull(swaggerV3Module,true));
    
  } catch (error) {
    console.log("error", error);
    result = false;
  }
  it('Module2ApiPostFull test', () => {
    
    console.log("Module2ApiPostFullModule2ApiPostFull",JSON.stringify(Module2ApiPostFull(swaggerV3Module,true).apis));
    expect(result).toEqual(true);
  });
});

