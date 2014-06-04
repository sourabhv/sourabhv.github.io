---
layout: post
title: Pyed Piper - The DOOM of Awk!
description: Pyed Piper (pyp) is a great command line text manipulation utility build over python
---

We all use `awk` for complex text-manipulation on our computers. But lets admit, its ugly! I mean really ugly. Just look at it ...

<pre class="terminal">
<span class="d">$</span> awk -F '|' "$1 ~ /http:\/\// {print $2}" a_very_long_name
</pre>

Yuck! Look at those slashes and quotes and stuff. But fear not little fella, I have a surprise for we. Ever heard of the Pyed Piper? Commonly known as `pyp`, is a really simple and readable text manipulation command line tool. Let's look at it, shall we?

p & pp is all we need
----------------------

We can just pipe (`|`) in your input into *pyp*, just like with any other command and they use python to manipulate it. And when in *pyp*, we can refer to each line as `p` or a list of all lines as `pp`. We can also chain these functions, just like in python. Let's look at a few example:

<pre class="terminal">
<span class="d">$</span> echo "foo is bar" | pyp "p.replace('bar', 'foobar')"
foo is foobar

<span class="d">$</span> echo "python's foo is bar" | pyp "p.replace('bar', 'foobar').replace('python', 'pyp')"
pyp's foo is foobar

<span class="d">$</span> echo "foo\nbar\npyp" | pyp "pp.sort()" # here pp is pyp
[0]bar
[1]foo
[2]pyp

<span class="d">$</span> echo "foo might be bar" | pyp "'-'.join(p.split(' ')[1:3])"
might-be
</pre>

In the last one, we split in whitespace, slice the output and then finally join on minus. I know what you are thinking. This is also geting a bit messy. But the piper does have some tricks up his sleeves.

Piper can pipe!
---------------

In *pyp* we can pipe the output of one function into another, thus removing the mess.

<pre class="terminal">
<span class="d">$</span> echo "foo might be bar" | pyp "p.split(' ')[1:3] | '-'.join(p)"
might-be

<span class="d">$</span> echo "this\nis a\nvery bad\nidea" | pyp "pp.sort() | p.split(' ') | '|'.join(p)"
idea
is|a
this
very|bad
</pre>

###Can we do any better?

*pyp* has some shorthands for splitting and joining to make those commands look even more sexy! You can use the keywords <span class="u">s</span>lash, <span class="u">d</span>ot, <span class="u">w</span>hitespace, <span class="u">u</span>nderscore, <span class="u">c</span>olon, co<span class="u">mm</span>a, <span class="u">m</span>inus and <span class="u">a</span>ll to split on them or just use the underlined characters as shorthands.

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

Now suppose you are making a really complex file rename and you wrote an amazing pyp command and you are ready to make the final `mv` command and pass it to shell. But hold on! whay about the original file names? This is where the pyp's history comes in, pyp stores the output of every command separated by pipe and it can be referred to as `history[0]`, `history[1]` ... or `h[0]`, `h[1]` ... etc. There's also a shorthand for original input (`o`) and split operations on it like `ou`, `ow`, `omm`, etc for splitting original input on underscore, whitespace, comma.

<pre class="terminal">
<span class="d">$</span> ls | pyp "u | (p[1:3] + p[4:5]) | m | 'mv', o, p + '.py'" | sh
</pre>

Notice the `(` and `)` around `p[1:3] + p[4:5]`. It is important when you are want join two slices. You can also do something as complex as this:

<pre class="terminal">
<span class="d">$</span> ls | pyp "(u[0:3] + m[1:2]) | mm | 'mv   ', o, '   ',  p + '.py'" | sh
</pre>

Here we are splitting on 2 different characters, namely underscore and minus. The one split doesn't affect other one, .e., the split `u` and `m` occurs on same input. For input `1_2_3_4-5-6-7` pyp will give `mv 1_2_3_4-5-6-7 1,2,3,5.py`



<!--
history - history[0], history[1],  history[2]

also history[0] == o as in original

and metachars ow ou os od om omm oa for splitting the original

pp work
    sort()
    uniq()
    delimit(delimiter)
    oneline
    list comprehension for filtering

filtering kept if returned true else loose it

p.isdigit()

fp sp fpp spp
-->
