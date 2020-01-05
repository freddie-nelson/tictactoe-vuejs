function arraysEqual(a, b) {
    /*
        Array-aware equality checker:
        Returns whether arguments a and b are == to each other;
        however if they are equal-lengthed arrays, returns whether their 
        elements are pairwise == to each other recursively under this
        definition.
    */
    if (a instanceof Array && b instanceof Array) {
        if (a.length != b.length) // assert same length
            return false;
        for (var i = 0; i < a.length; i++) // assert each element equal
            if (!this.arraysEqual(a[i], b[i]))
                return false;
        return true;
    } else {
        return a == b; // if not both arrays, should be the same
    }
}


function arrayMax(arr) {
    let maxNum = -1;
    let indexOfMaxNum = 0;

    for (let i = 0; i < arr.length; i++) {
        const num = arr[i];
        
        if (num > maxNum) {
            maxNum = num;
            indexOfMaxNum = i;
        }
    }

    return [maxNum, indexOfMaxNum];
}

export {
    arraysEqual,
    arrayMax
}