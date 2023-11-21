import subprocess
import re
import time

def make_request(base_utilization):
    i = 0
    command = ['curl', '-XGET', 'http://192.168.69.134']

    # Assuming dos_monitor is in the same directory as the Python script
    dos_monitor_command = ['./dos_monitor']
    dos_monitor_process = subprocess.Popen(dos_monitor_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)

    while True:
        print('\n================\nRequest {}\n'.format(i+1))

        # Run the curl command
        curl_process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        curl_output, curl_error = curl_process.communicate()
        print("Curl request sent. Output: {}".format(curl_output))

        # Read the output of dos_monitor in real-time
        dos_monitor_output = dos_monitor_process.stdout.readline()
        print(dos_monitor_output),

        # Print the captured runtime error (if any) from dos_monitor
        dos_monitor_error = dos_monitor_process.stderr.readline()
        if dos_monitor_error:
            print("Dos Monitor Error: {}".format(dos_monitor_error))

        # Extract the utilization percentage using regular expression from the first line
        if i == 0:
            match = re.search(r"CPU Utilization: (\d+\.\d+)%", dos_monitor_output)
            if match:
                base_utilization = float(match.group(1))
                print("Base Utilization: {}".format(base_utilization))

        # Extract the utilization percentage using regular expression from the current line
        match = re.search(r"CPU Utilization: (\d+\.\d+)%", dos_monitor_output)
        if match:
            utilization = float(match.group(1))
            print("Utilization: {}".format(utilization))

            # Check if the utilization is greater than or equal to (base + 40% of base)
            threshold_utilization = base_utilization + 0.4 * base_utilization
            if utilization >= threshold_utilization:
                print("CPU Utilization greater than or equal to {}%. Stopping the process.".format(threshold_utilization))
                dos_monitor_process.terminate()
                exit()

        i += 1
        time.sleep(1)

if __name__ == "__main__":
    base_utilization = 0.0  # Default value, will be updated from the first line of dos_monitor output
    make_request(base_utilization)
