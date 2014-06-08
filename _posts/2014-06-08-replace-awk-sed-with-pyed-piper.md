---
layout: post
title: Replace Awk/Sed with The Pyed Piper
description: Pyed Piper (pyp) is a great command line text manipulation utility build over python
---

We all use `awk` for complex text-manipulation. But lets admit it, awk is not the most readable command out there. I, infact, find it a little bit ugly. I mean, just look at it ...

<pre class="terminal">
<span class="d">$</span> awk -F '|' "$1 ~ /http:\/\// {print $2}" foo
</pre>

Yikes! Just look at those slashes and quotes and stuff. But don't worry fellas, I have a surprise for you. Presenting, <em>The Pyed Piper!</em> Commonly known as `pyp`, it is a really simple and readable python based text manipulation command line tool. Let's dig into it, shall we?

Installing pyp
--------------

There are many ways of installing `pyp`, easiest of which is by using pip:

<pre class="terminal">
<span class="d">$</span> pip install pyp
</pre>

If you don't have pip installed, you can download the script from [here](https://pyp.googlecode.com/files/pyp), make it executable and put it in your `$PATH`

<pre class="terminal">
<span class="d">$</span> wget https://pyp.googlecode.com/files/pyp
<span class="d">$</span> chmod +x pyp
<span class="d">$</span> sudo mv pyp /usr/bin/
</pre>

p & pp is all we need
----------------------

To use `pyp`, just pipe (`|`) the output of any command into pyp, just like you would do with any other command. And when in *pyp*, you can refer to each line as `p` or the list of all lines as `pp`. Any operation possible on a *string* can be done on `p` and any operation possible on a *list* can be done on `pp`. You can also chain these operations, just like in python. Let's look at a few example:

<pre class="terminal">
<span class="d">$</span> echo "foo is bar" | pyp "p.replace('bar', 'foobar')"
foo is foobar

<span class="d">$</span> echo "python's foo is bar" | pyp "p.replace('bar', 'yum').replace('py', 'pyp')"
pypthon's foo is yum

<span class="d">$</span> echo "foo\nbar\npyp" | pyp "pp.sort()"
[0]bar
[1]foo
[2]pyp

<span class="d">$</span> echo "foo might be bar" | pyp "'-'.join(p.split(' ')[1:3])"
might-be
</pre>

In the last one, we split the input on whitespace, slice the output and then finally join it on minus. I know what you are thinking, this is also geting a bit messy. But the piper does have some tricks up his sleeves.

Piper can pipe!
---------------

In *pyp* we can pipe the output of one function into another, thus removing the mess of chaining functions.

<pre class="terminal">
<span class="d">$</span> echo "foo might be bar" | pyp "p.split(' ')[1:3] | '-'.join(p)"
might-be

<span class="d">$</span> echo "this\nis a\nvery bad\nidea" | pyp "pp.sort() | p.split(' ') | '|'.join(p)"
idea
is|a
this
very|bad
</pre>

Notice that any string in pyp is enclosed in single quotes (`'`).

###Can we do any better?

The split and join operations on some characters is so common that *pyp* has some build-in keywords for them to make those commands look even more sexy! To split on whitespaces you can just pipe the input into `whitespace` and Voila! It splits on spaces. You can also just use `w` as its shorthand. Here's are all the available split/join keywords and their shorthands (shorthands are underlined): <span class="u">s</span>lash, <span class="u">d</span>ot, <span class="u">w</span>hitespace, <span class="u">u</span>nderscore, <span class="u">c</span>olon, <span class="u">m</span>inus, co<span class="u">mm</span>a and <span class="u">a</span>ll.

<pre class="terminal">
<span class="d">$</span> echo "foo might be bar" | pyp "whitespace[1:3] | minus"
might-be

<span class="d">$</span> echo "this\nis a\nvery bad\nidea" | pyp "pp.sort() | w | mm"
idea
is,a
this
very,bad
</pre>

Let's go back in time
---------------------

Now suppose you are making a really complex file rename and you wrote an amazing pyp command and you are ready to make the final `mv` command and pass it to shell. But hold on! whay about the original file names? Now this is where the pyp's history comes in. Pyp stores the output of every command separated by pipe in a variable called `history` (`h` for short) and it can be referred to as `history[0]`, `history[1]` ... or `h[0]`, `h[1]` ... etc (here `h[0]` refers to the original input).

<pre class="terminal">
<span class="d">$</span> ls
this_is_my_awsm_file-dont-touch    this_one_is_for_you-have-fun

<span class="d">$</span> ls | pyp "u | (p[1:3] + p[4:5]) | s | 'mv', o, p + '.py'"
mv this_is_my_awsm_file-dont-touch  is/my/file-dont-touch.py
mv this_one_is_for_you-have-fun     one/is/you-have-fun.py
</pre>

You can pass pipe this command to shell (`| sh`) and the `mv` command will take effect. Notice the `(` and `)` around `p[1:3] + p[4:5]`. It is important to use parens around slices when you want join them. Simply adding them with `+` won't work.

There's also a shorthand for original input: `o`. You can also use all the split/join keywords discussed above directly on the original input by prepending them with `o`. For example, to split the original input on underscore you can do `o.split('_')` or simply `ou`. A few other examples would be `ow`, `omm`, `oa` etc.

<pre class="terminal">
<span class="d">$</span> cat foo
~/Desktop/my_file.txt
~/Desktop/your_file.txt

<span class="d">$</span> cat foo | pyp "s[-1] | u | m | 'mv', os[-1], p"
mv my_file.txt    my-file.txt
mv your_file.txt  your-file.txt

<span class="d">$</span> cat foo | pyp "s[-1] | u | m | 'mv', h[1], p"
mv my_file.txt    my-file.txt
mv your_file.txt  your-file.txt

<span class="d">$</span> cat foo | pyp "s[-1] | u | m | 'mv', o, '/'.join(os[:-1]) + '/' + p"
mv ~/Desktop/my_file.txt ~/Desktop/my-file.txt
mv ~/Desktop/your_file.txt ~/Desktop/your-file.txt
</pre>

You can also do something as complex as this:

<pre class="terminal">
<span class="d">$</span> ls | pyp "(u[0:3] + m[1:2]) | '\ '.join(p) | 'mv', o, p"
mv this_is_my_awsm_file-dont-touch  this\ is\ my\ dont
mv this_one_is_for_you-have-fun     this\ one\ is\ have
</pre>

Here we are splitting on 2 different characters simultaneously, namely underscore and minus. One split doesn't affect the other one, i.e., the split on `u` and `m` occurs on same input.

Filtering in Pyp
----------------

Filtering is also very simple in pyp. If any function on `p` returns `True` then the line is kept or else it is eliminated. A few examples would be:

<pre class="terminal">
<span class="d">$</span> cat foo
all you need is
42
ESCAPE FROM
th1s cru3l w0r1d

<span class="d">$</span> cat foo | pyp "p.isdigit()"
42

<span class="d">$</span> cat foo | pyp "p.isupper()"
ESCAPE FROM

<span class="d">$</span> cat foo | pyp "p.islower()"
all you need is
th1s cru3l w0r1d
</pre>

###To keep or to loose

Pyp also comes with 2 handy functions - `keep('str1', 'str2', ...)` (shorthand: `k`) and `loose('str1', 'str2', ...)` (shorthand: `l`) which you can use to include or exclude lines which have the specified string.

<pre class="terminal">
<span class="d">$</span> cat foo
this will test your patience
and will power
for power is everything

<span class="d">$</span> cat foo | pyp "keep('power')"
and will power
for power is everything

<span class="d">$</span>  cat foo | pyp "l('will')"
for power is everything
</pre>

Math Operations
---------------

Suppose you have a csv file and you want to change values of a column, say 6th, to double of its value. You can do this easily in pyp:

<pre class="terminal">
<span class="d">$</span> cat foo.csv
Lorem,ipsum,dolor,sit,amet,5,adipisicing,elit,sed
tempor,incididunt,ut,labore,et,6,magna,aliqua,Ut
quis,nostrud,exercitation,ullamco,laboris,14,ut,aliquip,ex

<span class="d">$</span>cat foo.csv | pyp "mm[5] | str(int(p) * 2) | (omm[:5] + [p] + omm[6:]) | mm"
Lorem,ipsum,dolor,sit,amet,10,adipisicing,elit,sed
tempor,incididunt,ut,labore,et,12,magna,aliqua,Ut
quis,nostrud,exercitation,ullamco,laboris,28,ut,aliquip,ex
</pre>

Here we split the file on comma (`mm`), get the 6th column and multiply it with 2 (by converting it to *int* first and the converting back to *string*). Then we add back the 0 to 5th and 7th to last column and join back on comma to get the required csv. Finally you can append `> foo.csv` to redirect the output back into the csv file.

Manipulating the pp list
------------------------

To split file on a character other than newline: `pp.delimit(Delimiter)`

<pre class="terminal">
<span class="d">$</span> echo "foo|bar|test" | pyp "pp.delimit('|')"
[0]foo
[1]bar
[2]test
</pre>

To Consolidate n consicutive lines in 1: `pp.divide(n)`

<pre class="terminal">
<span class="d">$</span> echo "foo|bar|test|me|now" | pyp "pp.delimit('|') | pp.divide(3)"
[0][[0]foo[1]bar[2]test]
[1][[0]me[1]now]
</pre>

Here `[0][[0]foo[1]bar[2]test]` is a line in list `pp` and `[0]foo[1]bar[2]test` is similar to what you get after a split. You can append `| w` to the command to join on space and it will give you `foo bar test`.

To combine all list elements in one line with whitespace: `pp.oneline()`

<pre class="terminal">
<span class="d">$</span> echo "foo\nbar\nlorem" | pyp "pp.oneline()"
foo bar lorem
</pre>

Regular Expressions in Pyp
-------------------------

You can also use regular expression ([more here](https://docs.python.org/2/library/re.html)) to filter the input. `rekeep(REGEX)` and `relose(REGEX)` can be used to include and exclude the lines that match the `REGEX` pattern. Alternatively you can use `rek(REGEX)` and `rel(REGEX)` as their shorthands. This brings us to our original `awk` example. Let's see how we will do it using `pyp`

<pre class="terminal">
<span class="d">$</span> cat foo
http://www.google.com/loon
http://www.sourabhverma.com/blob
ftp://ftp.mozilla.com/ffx
https://mail.google.com/shhh
useless://line-here.yep/ignore/it
iam://not.reallya.link/YOUDONTSAY

<span class="d">$</span> cat foo | pyp "rek('^http://')"
http://www.google.com/loon
http://www.sourabhverma.com/blob

<span class="d">$</span> cat foo | pyp "rek('http://') | s[2:] | s | d[1:] | d"
google.com/loon
sourabhverma.com/blob
</pre>

Wow! Now isn't that super clean. Much better than `awk` if you ask me.

---------------

That's it for this post. But there's lot more interesting stuff in pyp. Here are some links for further reading. Thank you and Peace out!

\[1\]: [https://code.google.com/p/pyp/wiki/intro](https://code.google.com/p/pyp/wiki/intro) <br>
\[2\]: [https://code.google.com/p/pyp/wiki/basic_examples](https://code.google.com/p/pyp/wiki/basic_examples) <br>
\[3\]: [https://code.google.com/p/pyp/wiki/pyp_manual](https://code.google.com/p/pyp/wiki/pyp_manual)
