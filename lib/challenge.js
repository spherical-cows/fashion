var splitIntoLetters = function(sentence) {
  return sentence.split(' ').map(function(word) { return word.split(''); }).reduce(function(a, b) { b.forEach(function(l) { a.push(l); }); return a }, []);
}

var Challenge = function(sentence) {
  this.words = sentence.split(' ');
  this.chars = splitIntoLetters(sentence);
  this.enteredChars = 0;
  this.errored = false;
};

Challenge.prototype.advance = function() {
  this.enteredChars += 1;
};

Challenge.prototype.next = function() {
  return this.chars[this.enteredChars];
}

Challenge.prototype.complete = function() {
  return this.enteredChars === this.chars.length;
}

Challenge.prototype.length = function() {
  return this.chars.length;
}

Challenge.prototype.draw = function(albertX, albertY) {
  if (!this.complete()) {
    var speechBubbleArrow = new Image();
    speechBubbleArrow.src = 'assets/speech-bubble-arrow.png';
    atom.context.globalAlpha = 1;
    atom.context.drawImage(speechBubbleArrow, albertX + 32 * 4, albertY - 32, 8* 5, 8* 5);

    atom.context.font = '20px "8bit"';
    var text = this.words.join(' ');
    var textDimensions = atom.context.measureText(text);

    atom.context.strokeStyle = 'black';
    atom.context.lineWidth=5;
    atom.context.fillStyle = "white";
    atom.context.fillRect(atom.width / 2 - textDimensions.width / 2 - 30, albertY - 140, textDimensions.width + 60, 110);
    atom.context.strokeRect(atom.width / 2 - textDimensions.width / 2 - 30, albertY - 140, textDimensions.width + 60, 110);

    atom.context.strokeStyle = "white";
    atom.context.lineWidth = 10;
    atom.context.beginPath();
    atom.context.moveTo(albertX + 32 * 4 + 5, albertY - 30);
    atom.context.lineTo(albertX + 32 * 4 + 8 * 5 - 5, albertY - 30);
    atom.context.stroke();
    atom.context.closePath();

    atom.context.fillStyle = 'green';
    atom.context.fillText(text, atom.width / 2 - textDimensions.width / 2, albertY - 75);
    atom.context.fillStyle = 'black';

    // argh this is nasty, trying to retain spaces being dumb
    // worst code of my life
    // FALSE: BEST CODE EVAR
    text = ''
    spaces = 0
    for (var i = 0; i < this.words.length; i++) {
      var word = this.words[i]

      for (var j = 0; j < word.length; j++) {
        text += word[j]
      }

      if (text.length > this.enteredChars + spaces) {
        text = text.substring(0, this.enteredChars + spaces);
        break;
      }

      text += ' '
      spaces += 1
    }

    var entered = this.enteredChars;
    var enteredTextDimensions = atom.context.measureText(text);

    var indicator = new Image();
    indicator.src = 'assets/letter-indicator.png';
    atom.context.drawImage(indicator, atom.width / 2 - textDimensions.width / 2 - 5 + enteredTextDimensions.width, albertY - 65, 8 * 3, 8 * 3);
  }
}
