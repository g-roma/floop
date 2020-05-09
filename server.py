#! /usr/bin/env python
import random,time,sys,os
import subprocess
import json
from numpy import *
from scipy.io import *
from twisted.web import server, resource, static
from twisted.internet import reactor, threads
from scipy.spatial.distance import *
from scipy.cluster.vq import *
from sklearn.neighbors import NearestNeighbors

class FloopServer(resource.Resource):
    isLeaf = True
    def __init__(self):
        x = loadmat('loops.mat')
        loops = x['loops']
        #self.loops = loops[loops[:,3]>0]
        self.loops = loops
        y = loadmat('loop_descriptors.mat')
        self.descriptors = y['desc']

    def get_sounds_for_period(self,request):
        period = int(request.args['p'][0])
        x = self.loops[:,2]
        sounds_idx = nonzero(x==period)
        descr = self.descriptors[sounds_idx[0],:]
        w = whiten(descr[:,1:])
        N = descr.shape[0]
        graph_dict = {'nodes':[],'links':[]}
        c = 0.02
        k = int(min(c * N,5))
        nbrs = NearestNeighbors(n_neighbors = k).fit(w)
        dist, idx = nbrs.kneighbors(w)
        for i in range(N):
            graph_dict['nodes'].append({'id':int(descr[i,0])})
            #graph_dict['nodes'].append({'id':int(descr[i,0]),'group':membership[i]})
            for j in range(1,k):
                link = {'source':i,'target':idx[i,j],'value':dist[i,j]}
                graph_dict['links'].append(link)
        sounds = self.loops[sounds_idx,0]
        result = {'sounds':sounds[0].tolist(),'graph':graph_dict}
        return json.dumps(result)

    def get_histogram(self,request):
        l3 = self.loops[:,2]
        l3 = l3[l3>0]
        hh = histogram(l3,bins=arange(max(l3)+2))
        return json.dumps(hh[0][0:600].tolist())
     #return json.dumps(hh[0].tolist())

    def render_GET(self, request):
        ret = ""
        if len(request.postpath) == 1 and request.postpath[0]:
            try:
                method = getattr(self, request.postpath[0])
            except AttributeError:
                print("method not found")
                pass
            else:
                val = method(request)
                return val
        return ret
    def render_POST(self,request):
        return self.render_GET(request)
root = resource.Resource()
file_server = static.File("www")
file_server.putChild("index",FloopServer())
root.putChild("floop",file_server)
site = server.Site(root)
reactor.listenTCP(8003, site)
print("listening on port 8003")
reactor.run()
