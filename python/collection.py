from collections import namedtuple,deque,defaultdict,OrderedDict,Counter

Point = namedtuple('Point',['x','y'])
p = Point(1,2)
print('p点坐标为(%s,%s)' % (p.x,p.y))

q = deque(['a','b','c'])
q.append('x')
q.appendleft('y')
print(q)
q.pop()
q.popleft()
print(q)

dd = defaultdict(lambda:'wangteng')
dd['key1'] = 'abc'
print(dd['key1'],dd['key2'])

d=dict([('a',1),('b',2),('c',3)])
print(d)

od = OrderedDict([('a',1),('b',2),('c',3)])
print(od)

ood=OrderedDict()
ood['z'] = 1
ood['y'] = 2
ood['x'] = 3

print(list(ood.keys()))




c = Counter()
for ch in 'programming':
    c[ch] = c[ch]+1

print(c)