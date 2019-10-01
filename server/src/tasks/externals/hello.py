import sys 
import getopt 

if __name__ == "__main__": 
    argv = sys.argv[1:]
    
    try: 
        opts, args = getopt.getopt(argv, 't:', ['text='])
    except getopt.GetoptError as err: 
        print('usage: -t <sourcetext> OR --text=<sourcetext>')
   
    for opt, arg in opts: 
        if opt in ['-t', '--text']: 
            sourceText = arg 
            print(sourceText[::-1])