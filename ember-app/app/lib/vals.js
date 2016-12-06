$.fn.vals = function() {
    var first = this.get(0);
    if ( this.length === 0 ){
        return [];
    }

    if ( first.tagName === 'SELECT' && first.multiple ) {
        return this.val();
    }

    return this.map(function() { return this.value; }).get();
};