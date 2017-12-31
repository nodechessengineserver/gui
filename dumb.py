import os
import json

srcpath="assets/neural"
targetpath="assets/neural2"

def init():
	os.makedirs(targetpath)

def dumb(full):
	dmb=[]
	for i in range(0,14):
		for j in range(0,14):
			b1=i*2*28+j*2
			b2=i*2*28+28+j*2
			avg=(full[b1]+full[b1+1]+full[b2]+full[b2+1])/4
			value=0
			limit=0.6
			if(avg>limit):
				value=1
			"""if ((full[b1]>limit) or (full[b1+1]>limit) or (full[b2]>limit) or (full[b2+1]>limit)):
				value=1"""
			dmb.append(value)
	return dmb

def walk():
	cnt=0
	for dirname, dirnames, filenames in os.walk(srcpath):		
		for filename in filenames:			
			spath=os.path.join(dirname,filename)
			tpath=os.path.join(targetpath,os.path.join(dirname, filename)[len(srcpath)+1:])
			dpath=os.path.dirname(tpath)
			if not os.path.exists(dpath):
				os.makedirs(dpath)						
			print("process "+spath)				
			data=json.load(open(spath))
			for i in range(0,1000):
				data[i][0]=dumb(data[i][0])
			"""for i in range(0,14):
				line=""
				for j in range(0,14):
					c=dmb[i*14+j]
					if c>0:
						line+="x"
					else:
						line+=" "
				print(line)"""
			with open(tpath, 'w') as outfile:
				json.dump(data, outfile)
			cnt+=1
			if cnt>=1000:
				return				