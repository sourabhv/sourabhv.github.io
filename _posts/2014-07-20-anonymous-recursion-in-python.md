---
layout: post
title: Anonymous Recursion in Python
description: Self-Invoking Anonymous Recursion in Python using lambda functions and Combinators
---

Wait, anonymous recursion? In python? Do things like this exist in the pythoniverse? (it'll be a thing one day, just wait for it). Not directly but we can use some supernatural mathematical logic to create it.

We usually use `def` to define a new function. Some of you might have heard of `lambda` functions. Lambda functions are one-line functions which return the result of that one line. They are mostly used to create small functions inline without cluttering up the namespace.

A Gist of Lambda Functions
--------------------------

General syntax of lambda functions is: `lambda [par1[, par2[, par2 ...]]] : [body]`. The parameters length can be 0 or more. The body cannot be empty. Example:

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

You can also call lambda functions inline without assigning them to a variable.

{% highlight python %}
>>> (lambda x: 'Hello ' + x)('World')
'Hello World'
>>> (lambda x, y: [x(i) for i in y])(lambda x: x**2, [1, 2, 3, 4])
[1, 4, 9, 16]
{% endhighlight %}

So now we have anonymous functions. Great! But what about recursion?

Recursion using Lambda functions
--------------------------------

We can also recurse using lambda functions. Lets try to make factorial functions using lambda functions.

{% highlight python %}
>>> fact = lambda f, n: 1 if n == 1 else n * f(f, n-1)
>>> fact(fact, 5)
120
{% endhighlight %}

We pass the lambda function to itself to call it within the function. But its not anonymous anymore as we have to name it. But we can use a wrapper that will be passed this function and any parameters for it. Lets do this step by step and make the wrapper function first.

{% highlight python %}
>>> wrapper = lambda f, n: f(f, n)
>>> fact = lambda f, n: 1 if n == 1 else n * f(f, n-1)
>>> wrapper(fact, 5)
120
{% endhighlight %}

Great! So now we can call the wrapper function anonymously and get rid of its name.

{% highlight python %}
>>> fact = lambda f, n: 1 if n == 1 else n * f(f, n-1)
>>> (lambda f, n: f(f, n))(fact, 5)
120
{% endhighlight %}

But we can also define lambda functions inline and get rid of the name `fact` too.

{% highlight python %}
>>> (lambda f, n: f(f, n))(
...     lambda f, n: 1 if n == 1 else n * f(f, n-1),
...     5)
120
{% endhighlight %}

And there you go! Your very own anonymous recursion function in python.

This last piece of code is known as a combinator
