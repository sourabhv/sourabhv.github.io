---
layout: post
title: Tree utility in Python
description: Porting a simpler version of the famous *nix tree utility in Python
---

Porting the famous *nix tree utility in Python, a simpler version of it i.e.

This has been in my drafts for far too long so I'll skip all the content writing and post the code, here it is:

{% highlight python %}
from os import listdir
from os.path import isfile, join, basename

def ls(path='~'):
    '''List files/folders in given path (default: home directory)

    returns 2 lists - files and folders
    '''

    files, dirs = [], []
    for item in listdir(path):
        if isfile(join(path, item)):
            files.append(item)
        else:
            dirs.append(item)
    return files, dirs

def tree(path, depth=1, max_depth=10, show_hidden=False, pad_info=[]):
    '''Print contents of directories in a tree-like format
    By default, it prints upto a depth of 100 and doesn't print hidden
    files, ie, files whose name begin with a '.'

    returns number of files, number of directories encountered
    '''

    if depth > max_depth:
        return 0, 0

    files, dirs = ls(path)
    if not show_hidden:
        files = [x for x in files if not x.startswith('.')]
        dirs = [x for x in dirs if not x.startswith('.')]
    fileCount, dirCount = len(files), len(dirs)
    dirs = [join(path, x) for x in dirs]

    for i, file in enumerate(files):
        padding = ['|   ' if x == 'nl' else '    ' for x in pad_info]
        padding = ''.join(padding)
        prefix = '`-- ' if i == len(files) - 1 and not dirs else '|-- '
        print('%s%s%s' % (padding, prefix, file))

    for i, dir in enumerate(dirs):
        padding = ['|   ' if x == 'nl' else '    ' for x in pad_info]
        padding = ''.join(padding)
        dirname = basename(dir)
        prefix = '`-- ' if i == len(dirs) - 1 else '|-- '
        print('%s%s%s' % (padding, prefix, dirname))
        new_pad_info = pad_info + (['l'] if i == len(dirs) - 1 else ['nl'])
        fc, dc = tree(join(path, dirname), depth=depth+1,
                      max_depth=max_depth, show_hidden=show_hidden,
                      pad_info=new_pad_info)
        fileCount += fc
        dirCount += dc

    return fileCount, dirCount
{% endhighlight %}

Running it on this blog's repo gives:

{% highlight %}
>> tree('/Users/sourabh/Code/blog/sourabhv.github.io', max_depth=2)
|-- 404.html
|-- _config.yml
|-- CNAME
|-- feed.css
|-- feed.xml
|-- index.html
|-- README.md
|-- sitemap.xml
|-- _drafts
|   |-- coffeescript-primer.md
|   |-- project-eular-24.md
|   `-- tree-utility-in-python.md
|-- _includes
|   |-- disqus.html
|   |-- footer.html
|   |-- head.html
|   |-- header.html
|   |-- css
|   `-- js
|-- _layouts
|   |-- default.html
|   |-- none.html
|   |-- page.html
|   `-- post.html
|-- _posts
|   |-- 2014-06-06-hello-world-ofbuscated.md
|   |-- 2014-06-08-replace-awk-sed-with-pyed-piper.md
|   |-- 2014-07-20-anonymous-recursion-in-python.md
|   |-- 2014-09-18-dropbox-command-line-tool-1.md
|   |-- 2014-09-21-dropbox-command-line-tool-2.md
|   `-- 2014-09-7-decorators-in-python.md
... and it goes on
{% endhighlight %}
