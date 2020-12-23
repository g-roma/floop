from aiohttp import web
import socketio
import random, time, sys, os
import subprocess
import json
from numpy import *
from scipy.io import *
from scipy.spatial.distance import *
from scipy.cluster.vq import *
from sklearn.neighbors import NearestNeighbors

app_path = '' # path to directory containing this file
app_password = '' # password for all users
freesound_token = ''# freesound API token

sio = socketio.AsyncServer()
app = web.Application()
sio.attach(app)

data = {}
users = {}
usernames = []

def load_data():
    x = loadmat('loops.mat')
    data["loops"] = x['loops']
    y = loadmat('loop_descriptors.mat')
    data["descriptors"] = y['desc']

async def get_sounds_for_period(request):
    period = int(request.rel_url.query['p'])
    x = data["loops"][:,2]
    sounds_idx = nonzero(x == period)
    descr = data["descriptors"][sounds_idx[0],:]
    w = whiten(descr[:,1:])
    N = descr.shape[0]
    graph_dict = {'nodes':[],'links':[]}
    c = 0.02
    k = int(min(c * N,5))
    nbrs = NearestNeighbors(n_neighbors = k).fit(w)
    dist, idx = nbrs.kneighbors(w)
    for i in range(N):
        graph_dict['nodes'].append({'id':int(descr[i, 0])})
        for j in range(1,k):
            link = {'source':int(i),'target':int(idx[i, j]),'value':float(dist[i, j])}
            graph_dict['links'].append(link)
    sounds = data["loops"][sounds_idx,0]
    snds = [int(x) for x in sounds[0].tolist()]
    result = {'sounds':snds,'graph':graph_dict}
    x = json.dumps(snds)
    y = json.dumps(graph_dict)
    return web.Response(text = json.dumps(result), content_type='application/json')

async def get_histogram(request):
    l3 = data["loops"][:, 2]
    l3 = l3[l3 > 0]
    hh = histogram(l3, bins = arange(max(l3) + 2))
    return web.Response(text = json.dumps(hh[0][0:600].tolist()), content_type='application/json')

async def get_token(request):
    return web.Response(text = json.dumps(freesound_token) , content_type='application/json')

async def index(request):
    with open(app_path+'/www/index.html') as f:
        return web.Response(text = f.read(), content_type='text/html')

@sio.event
def connect(sid, environ):
    pass

@sio.event
async def login(sid, username, password):
    if sid in users.keys():
        return "already logged"
    elif username in usernames:
        return "username taken"
    elif password == app_password:
        users[sid] = username
        usernames.append(username)
        await sio.emit('logged_users', usernames)
        return "OK"

@sio.event
async def message(sid, message):
    await sio.emit('message', message)

@sio.event
async def play(sid, snd, idx, usr):
    await sio.emit('play', [snd, idx, usr])

@sio.event
async def disconnect(sid):
    if sid in users.keys():
        username = users[sid]
        if username in usernames:
            usernames.remove(username)
            del usernames[username]
        del users[sid]
    await sio.emit('logged_users', usernames)

app.router.add_static('/js/', path = str(app_path + "/" + 'www/js'), name = 'js')
app.router.add_static('/modules/', path = str(app_path + "/" +'www/modules'), name = 'modules')
app.router.add_get('/', index)
app.router.add_get('/index/token', get_token)
app.router.add_get('/index/get_sounds_for_period', get_sounds_for_period)
app.router.add_get('/index/get_histogram', get_histogram)

if __name__ == '__main__':
    load_data()
    web.run_app(app)
