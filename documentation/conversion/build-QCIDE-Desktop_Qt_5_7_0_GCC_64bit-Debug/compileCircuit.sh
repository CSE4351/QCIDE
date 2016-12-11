echo $1
cp $1 qasm2circ-v1.4
cd qasm2circ-v1.4
csh qasm2png $1
mv $1.png ..
rm $1.*
