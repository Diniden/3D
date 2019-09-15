import * as lib from '../src';

function ready(fn: Function) {
  if (document.readyState !== 'loading') {
    fn();
  } else if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', () => {
      fn();
    });
  } else {
    (document as any).attachEvent('onreadystatechange', function() {
      if (document.readyState !== 'loading') fn();
    });
  }
}

async function start() {

}

// Wait for the document to be ready before executing start up logic
ready(start);
