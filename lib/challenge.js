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

Challenge.prototype.draw = function() {
  if (!this.complete()) {
    atom.context.font = '20px "8bit"';
    var text = this.words.join(' ');
    var textDimensions = atom.context.measureText(text);
    atom.context.fillStyle = 'yellow';
    atom.context.fillText(text, atom.width / 2 - textDimensions.width / 2, 150);
    atom.context.fillStyle = 'black';

    // argh this is nasty, trying to retain spaces being dumb
    // worst code of my life
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

    atom.context.fillText(text, atom.width / 2 - textDimensions.width / 2, 150);
  }
}
