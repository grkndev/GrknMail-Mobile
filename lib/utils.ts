
if (!String.prototype.truncate) {
    String.prototype.truncate = function (maxLength: number): string {
      if (typeof maxLength !== "number" || maxLength <= 0) return "";
  
      if (this.length <= maxLength) return this.toString();
  
      return this.slice(0, maxLength) + '...';
    };
  }
  