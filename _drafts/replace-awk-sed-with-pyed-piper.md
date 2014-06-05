---
layout: post
title: Replace Awk/Sed with The Pyed Piper
description: Pyed Piper (pyp) is a great command line text manipulation utility build over python
---

We all use `awk` for complex text-manipulation on our computers. But lets admit it, awk is not the most readable command out there. I, infact, find it a bit ugly. I mean, just look at it ...

<pre class="terminal">
<span class="d">$</span> awk -F '|' "$1 ~ /http:\/\// {print $2}" foo
</pre>

Yikes! Just look at those slashes and quotes and stuff. But don't worry fellas, I have a surprise for you. Presenting, <em>The Pyed Piper!</em> Commonly known as `pyp`, it is a really simple and readable python based text manipulation command line tool. Let's dig into it, shall we?

p & pp is all we need
----------------------

To use `pyp`, just pipe (`|`) the output of any command into pyp, just like you would do with any other command. And when in *pyp*, you can refer to each line as `p` or a list of all lines as `pp`. Any operation possible on a *string* can be done on `p` and any operation possible on a *list* can be done on `pp`. You can also chain these operations, just like in python. Let's look at a few example:

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

Now suppose you are making a really complex file rename and you wrote an amazing pyp command and you are ready to make the final `mv` command and pass it to shell. But hold on! whay about the original file names? This is where the pyp's history comes in, pyp stores the output of every command separated by pipe and it can be referred to as `history[0]`, `history[1]` ... or `h[0]`, `h[1]` ... etc. There's also a shorthand for original input: `o`. Also, you can use all split keywords like split operations on it like `ou`, `ow`, `omm`, etc for splitting original input on underscore, whitespace, comma.

<pre class="terminal">
<span class="d">$</span> ls | pyp "u | (p[1:3] + p[4:5]) | m | 'mv', o, p + '.py'" | sh
</pre>

Notice the `(` and `)` around `p[1:3] + p[4:5]`. It is important when you are want join two slices. You can also do something as complex as this:

<pre class="terminal">
<span class="d">$</span> ls | pyp "(u[0:3] + m[1:2]) | mm | 'mv', o, p + '.py'" | sh
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
