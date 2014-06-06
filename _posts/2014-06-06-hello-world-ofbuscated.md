---
layout: post
title: Hello World
description: Ben Kurtovic's first place winner of Ofbuscated Hello world Code Golf
---

> A few months ago, I got first place in this Code Golf contest to create the weirdest obfuscated program that prints the string “Hello world!”. I decided to write up an explanation of how the hell it works. So, here’s the entry, in Python 2.7:

And here's the code:

{% highlight python %}
(lambda _, __, ___, ____, _____, ______, _______, ________:
    getattr(
        __import__(True.__class__.__name__[_] + [].__class__.__name__[__]),
        ().__class__.__eq__.__class__.__name__[:__] +
        ().__iter__().__class__.__name__[_____:________]
    )(
        _, (lambda _, __, ___: _(_, __, ___))(
            lambda _, __, ___:
                chr(___ % __) + _(_, __, ___ // __) if ___ else
                (lambda: _).func_code.co_lnotab,
            _ << ________,
            (((_____ << ____) + _) << ((___ << _____) - ___)) +
            (((((___ << __) - _) << ___) + _) << ((_____ << ____) + (_ << _))) +
            (((_______ << __) - _) << (((((_ << ___) + _)) << ___) + (_ << _))) +
            (((_______ << ___) + _) << ((_ << ______) + _)) +
            (((_______ << ____) - _) << ((_______ << ___))) +
            (((_ << ____) - _) << ((((___ << __) + _) << __) - _)) -
            (_______ << ((((___ << __) - _) << __) + _)) +
            (_______ << (((((_ << ___) + _)) << __))) -
            ((((((_ << ___) + _)) << __) + _) << ((((___ << __) + _) << _))) +
            (((_______ << __) - _) << (((((_ << ___) + _)) << _))) +
            (((___ << ___) + _) << ((_____ << _))) +
            (_____ << ______) +
            (_ << ___)
        )
    )
)(
    *(lambda _, __, ___: _(_, __, ___))(
        (lambda _, __, ___:
            [__(___[(lambda: _).func_code.co_nlocals])] +
            _(_, __, ___[(lambda _: _).func_code.co_nlocals:]) if ___ else []
        ),
        lambda _: _.func_code.co_argcount,
        (
            lambda _: _,
            lambda _, __: _,
            lambda _, __, ___: _,
            lambda _, __, ___, ____: _,
            lambda _, __, ___, ____, _____: _,
            lambda _, __, ___, ____, _____, ______: _,
            lambda _, __, ___, ____, _____, ______, _______: _,
            lambda _, __, ___, ____, _____, ______, _______, ________: _
        )
    )
)
{% endhighlight %}

Go ahead, run it! It'll give you the much expected `Hello world!`.

<a href="http://earwig.github.io/2014/06/01/obfuscating-hello-world.html">Read more here &#187;</a>
