---
layout: post
title: Anonymous Recursion in Python
description: Self-Invoking Anonymous Recursion in Python using lambda functions and Combinators
---

Wait, anonymous recursion? In python? Do things like this exist in the pythoniverse? (it'll be a thing one day, just wait for it). Not directly but we can use some supernatural mathematical logic to create it.

We usually use `def` to define a new function. Some of you might have heard of `lambda` functions. Lambda functions are one-line functions which return the result of that one line. They are mostly used to create small functions inline without cluttering up the namespace.

Lambda ______
-------------

General syntax of lambda functions is: `lamnda [par1[, par2[, par2 ...]]] : [body]`. The parameters length can be 0 or more. The body cannot be empty. Example:

{% highlight python %}
>>> hello = lambda word: 'Hello ' + word
>>> hello('world')
Hello world

>>> divisible_by_2 = lambda x: x % 2 == 0
>>> divisible_by_2(1234)
True
{% endhighlight %}

Lambda functions can also recieve lists using `*` at the beginning of parameter name.

{% highlight python %}
>>> here = lambda * x: os.path.join(os.path.abspath(__file__), *x)
>>> here('python', 'ipython')
'/tmp/python/ipython'
{% endhighlight %}

This function appends the directory/file name you pass to it into path of current file. You can pass it as many parameters you want.

You can also pass lambda functions to other lambda functions

{% highlight python %}
>>> map = lambda x, y: [x(i) for i in y]
>>> sqr = lambda x: x**2
>>> map(sqr, [1, 2, 3, 4])
[1, 4, 9, 16]
{% endhighlight %}

The `map` function already exists but now you know how to make one yourself.

###Anonymous Lambda Functions


