---
layout: post
title: CoffeeScript Primer
description: Your guide to first cup of CoffeeScript
---

CoffeeScript is a really great and funky JavaScript preprocessor. And it's not even that big, you can learn it all in a couple of hours. But unfortunately, most CoffeeScript tutorials are not that great and reading a book is not what I would advice.

So I decided to write something good on my own. Here it goes ...

Say no to var
---------------
In CoffeeScript, there is no `var` keyword, so creating a variable is as simple as:

{% highlight coffeescript %}
a = "I actually hate coffee"
# var a = "I actually hate coffee";
{% endhighlight %}

###Scope

{% highlight coffeescript %}
four = "I am number four"
nextVersion = ->
  four = "I am number five" # uh oh!
nextVersion()

# var four, nextVersion;
# four = "I am number four";
# nextVersion = function() {
#     return four = "I am number five";
# };
# nextVersion();
{% endhighlight %}

Now this creates some confusion as to how scope works in coffeescript. If you have any experience with Python, then this will be rather intuitive for you. Firstly, all variables are declared at top of closest scope. Secondly, whenever a variable is encountered, coffeescript checks if its already declared in this scope or any scope above it. So, if you want to create a same name in an inner scope, you can't! CoffeeScript will use the variable in outer scope automatically. Instead, you must use a different name. CoffeeScript says that it ensures variable safety. I actually find this irritating

In the above example, we change the value of variable `four` in outer scope when `nextVersion` is called.

###Arrays & Objects

{% highlight coffeescript %}
deep_thought =
  question: ""
  answer: 42
  siblings:
    earth:
      age: '10,000,000'
      sex: 'ummm?'
    skynet:
      age: '1000?'
      sex: 'female? I hope'

# deep_thought = {
#   question: "",
#   answer: 42,
#   siblings: {
#     earth: {
#       age: '10,000,000',
#       sex: 'ummm?'
#     },
#     skynet: {
#       age: '1000?',
#       sex: 'female? I hope'
#     }
#   }
# };



{% endhighlight %}

A cool thing
