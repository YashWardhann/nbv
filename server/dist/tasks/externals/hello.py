import sys 
import getopt

def main(): 
    
    usage = "usage: -f <source_text>"
    dataStore = None
    
    argv = sys.argv[1:]

    try: 
        opts, args = getopt.getopt(argv, "s:", ["source="])
    except getopt.GetoptError as err: 
        print(usage)
        sys.exit(2)
    
    for opt, arg in opts:
        if opt in ['-s', '--source']: 
            dataStore = arg
        elif opt in ['-f', '--format']: 
            dataStore = arg

    index = []
    for id, val in enumerate(dataStore): 
        if val in ['a', 'e', 'i', 'o', 'u']: 
            index.append(id)

    for i in index: 
        print(i, end=' ')
main()