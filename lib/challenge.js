var Challenge = function(chars) {
  this.chars = chars;
  this.enteredChars = [];
};

Challenge.prototype.advance = function() {
  this.enteredChars.push(this.next());
};

Challenge.prototype.next = function() {
  return this.chars[this.enteredChars.length];
}

Challenge.prototype.complete = function() {
  return this.enteredChars.length === this.chars.length;
}
