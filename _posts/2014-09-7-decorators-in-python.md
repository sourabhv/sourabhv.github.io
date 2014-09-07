---
layout: post
title: Decorators in Python
description: A gist of decorators in Python and how to create your own
---

Decorators can be confusing. That cool syntax with those awesome names that do stuff for you in ways you don't really understand, but always working for you, anonymously, secretly! Wait, what were we talking about? Oh yeah, Decorators! Let's break down the puzzle step by step. If you get stuck anywhere, feel free to email me.

Functions
---------

A function is like a box which takes in stuff (parameters), does some work (process) and then throws out something (output). A python function looks something like this:

{% highlight python %}
def end_of_the_world():
    print('No, not really')

end_of_the_world()
>>> 'No, not really'
{% endhighlight %}

Simple, right? Lets move on.

Scope
-----

In python every function creates its own scope or namespace. When trying to access some variable, python first looks for it in local scope. It its found then great, else it proceeds to the scope above it. This happens till the global namespace at which point python returns `NameError` if the name is still not found. Assignment happens a little differently, if a variable you're trying to assign value to, doesn't exist in local scope, a new variable is created. An example will make things clear.

{% highlight python %}
zap = 'I zap you!'
def foo():
    bop = 'bop!'
    print('In foo -> bop = %s' % bop)
    bop, zap = 'Bopped!', 'Zapped!'   # 1
    print('In foo -> bop = %s' % bop)
    print('In foo -> zap = %s' % zap) # 2

foo()
print('!In foo -> zap: %s' % zap)     # 3
try:
    print('!In foo -> bop: %s' % bop) # 4
except NameError:
    print('Bop not found')
{% endhighlight %}

{% highlight text %}
>>> In foo -> bop = bop!
>>> In foo -> bop = Bopped!
>>> In foo -> zap = Zapped!
>>> !In foo -> zap: I zap you!
>>> Bop not found
{% endhighlight %}

At #1, a new local variable called `zap` is created with value `'Zapped!'`. Then at #2 that local variable is accessed. At #3 the global `zap` variable is accessed as the `zap` in `foo()` is not in the scope (also, it doesn't exist anymore). Then at #4 python fails to find `bop` in scope and gives `NameError`.

Nested Functions
----------------

In python, functions are first class citizens. This means that the rules that apply to variables also apply to functions.

{% highlight python %}
issubclass(int, object)
>>> True

def bar():
    pass

bar.__class__
>>> <type 'function'>

issubclass(bar.__class__, object)
>>> True
{% endhighlight %}

(Insert your favourite wow expression here)

So, object is a base class for all primary data types and functions. Actually, Everything is an object in Python.

{% highlight python %}
def foo():
    blob = 'Hi! I am a blob'
    def bar():
        blob = 'Yo! Blob here'
        print(blob)
    bar()
    print(blob)
foo()
{% endhighlight %}

{% highlight text %}
>>> Yo! Blob here
>>> Hi! I am a blob
{% endhighlight %}

So functions behave exactly same as how variables behave. That's because behind the curtain they are actually same, Objects!

Closures
--------

A Closure is a function that returns a function. There's not much to say about this except giving an example:

{% highlight python %}
import os

def here(basepath):
    def f(*path):
        return os.path.join(basepath, *path)
    return f

usr = here('/usr')
print(usr('bin', 'cal')) # 1
{% endhighlight %}

{% highlight text %}
>>> /usr/bin/cal
{% endhighlight %}

`here()` accepts a parameter called `basepath` and returns a function called `f` which joins paths using `os.path.join`. When `usr()` is used at #1, you might think that it'll give `NameError` but it doesn't. This is because python has a feature called _function closures_ which allows function non-global functions to preserve everything in their scope at definition time.

Decorators
----------

A decorator is a closure that accepts a function, modifies and returns a new function. Essentially, they are function modifiers. Let's write a repeat decorator

{% highlight python %}
def repeat(f, times=3):
    def new_f():
        for x in range(times):
            f()
    return new_f

def printhello():
    print('Hello')

printhello = repeat(printhello, times=5)
printhello()
{% endhighlight %}

{% highlight text %}
>>> Hello
>>> Hello
>>> Hello
>>> Hello
>>> Hello
{% endhighlight %}

The `repeat()` takes 2 arguments, the first one is the function to be decorated and the second one is the number of times you want to repeat that function. `new_f()` is the new function that repeats `f()` `times` number of times. `times` is a named argument and is `3` by default

The @ Syntax
------------

Python 2.4 added a new syntax for using the decorators. Instead of using `func = decorator(func)` you can do this:

{% highlight python %}
@decorator
def func():
    pass
{% endhighlight %}

That being said, the syntax for a decorator with arguments is a bit weird. If you want to use it with the `@` syntax. Here's the `repeat` decorator rewritten for `@` syntax:

{% highlight python %}
def repeat(times=1):
    def decorator(f): # 1
        def new_f(): # 2
            for x in range(times):
                f()
        return new_f
    return decorator

@repeat(times=2) # or you can do @repeat(2)
def echo():
    str = raw_input()
    print(str)
echo()
{% endhighlight %}

{% highlight text %}
>>> Python
>>> Python
>>> Decorators
>>> Decorators
{% endhighlight %}

Let me sum that up for you in one line:

> A decorator with arguments is a function that takes arguments and returns a function that takes a function and returns a function.

In other words, the `repeat()`, which is a decorator, should return a function which itself is a decorator. The outer decorator takes the arguments and the inner one takes the function to be decorated and return the new function. This way, the arguments are in namespace of outer decorator and function `f()` in scope of inner decorator.

A little confusing, isn't it? That's why there is another way to do it.

Decorators using Classes
------------------------

Let's try rewriting the `repeat` decorator using a class.

{% highlight python %}
class repeat(object):

    def __init__(self, func):
        print('inside __init__')
        self.times = 3
        self.func = func

    def __call__(self, person):
        print('Inside __call__')
        print('Calling function %d times' % self.times)
        for x in range(self.times):
            self.func(person)

@repeat
def greet(person):
    print('Greetings %s!' % person)

print('~~Calling greet~~')
greet('Python User')
{% endhighlight %}

{% highlight text %}
>>> inside __init__
>>> ~~Calling greet~~
>>> Inside __call__
>>> Calling function 3 times
>>> Greetings Python User!
>>> Greetings Python User!
>>> Greetings Python User!
{% endhighlight %}

As you can see here, the `repeat` class's `__init__` method is called at the time of function definitin and the `__call__` is called when the function is used. So `__call__` behaves like the new decorated function. The argumens of the function being decorated and `__call__` should be same, except the `self` of course.

But wait, this is not a decorator with arguments! Well, no. The syntax of a decorator with arguments using class is again different from the one which doesn't accept any arguments. Let's take a look at the final repeat decorator.

{% highlight python %}
class repeat(object):

    def __init__(self, times=1):
        print('inside __init__')
        self.times = times

    def __call__(self, f):
        print('Inside __call__')

        def new_f(person):
            for x in range(self.times):
                f(person)
        return new_f

@repeat(5)
def greet(person):
    print('Greetings %s!' % person)

print('~~Calling greet~~')
greet('Guido')
{% endhighlight %}

{% highlight text %}
>>> inside __init__
>>> Inside __call__
>>> ~~Calling greet~~
>>> Greetings Guido!
>>> Greetings Guido!
>>> Greetings Guido!
>>> Greetings Guido!
>>> Greetings Guido!
{% endhighlight %}

So what's going on here? The `__init__` and `__call__` methods are called only at the time of definition and `__call__` returns `new_f`, the decorated function. `__init__` is used to take care of the argument and `__call__` is used to create the new function which is returned. Its very much like using function decorators, only a little more elegant.

What's Next?
------------

If you're interested in reading more about decorators then go see a doctor! No, seriously, I mean it. And if that doesn't help, they you can try reading [Bruce Eckel](http://www.bruceeckel.com/)'s post: [A Decorator-Based Build System](http://www.artima.com/weblogs/viewpost.jsp?thread=241209). And don't forget to email me if you have any questions, suggestion or if you found a typo! Until next time, Bye!
