CodeMirror.defineMode("qasm", function(config, parserConfig) {
        return {
            token: function(stream, state) {
                if (stream.match("//")) {
                    for (; null != (ch = stream.next()) && "\n" != ch;);
                    return "comment"
                }
                for (var specialGates = ["reset", "barrier", "if", "measure", "qreg", "creg", "gate", "include", "opaque"], i = 0; i < specialGates.length; i++) {
                    var exp = eval("/^" + specialGates[i] + "(\\s|\\()/"),
                        match = stream.match(exp, !0);
                    if (match) return stream.backUp(1), "string"
                }
                var exp = eval("/^[a-z][a-zA-Z0-9]*/");
                if (stream.match(exp)) {
                    stream.eatSpace();
                    var nextChar = stream.peek();
                    if (nextChar && nextChar.match(/(\(|[a-zA-Z])/)) return "atom";
                    if (nextChar && nextChar.match(/(\-|,|;|{|=)/)) return "blue-strong"
                }
                if (stream.match("[")) {
                    for (; null != (ch = stream.next()) && "]" != ch;);
                    return "blue"
                }
                for (; null != stream.next() && !stream.match("[", !1);) return null;
                return null
            }
        }
    });
