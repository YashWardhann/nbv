from __future__ import division 
from nltk.corpus import stopwords 
from nltk.tokenize import word_tokenize
import sys 
import getopt 
import operator 
import string
import nltk

class RakeKeywordExtractor: 
    def __init__(self, text = None): 
        # Stores the text to be analyzed 
        self.text = text
        # Stores the stopwords and phrase delimiters for the text 
        self.stopwords = []
        # Stores the content words for the text 
        self.content_words = [] 
        # The co-occurence matrix for the text 
        self.word_matrix = []
        # Stores the degree score for the words  
        self.scores = [] 

    def setStopWords(self): 
        stop_words = set(stopwords.words('english'))
        word_tokens = word_tokenize(self.text)

        self.stopwords = [w for w in word_tokens if w in stop_words]
    
    def setContentWords(self): 
        word_tokens = word_tokenize(self.text)
        self.content_words = [w for w in word_tokens if w not in self.stopwords]
    
    def extract(self): 
        # Generate the word matrix for the text
        # The matrix should be an len(self.content_words) * len(self.content_words) matrix 
        n = len(self.content_words)

        # o(n^2) implementation
        for i in range(n): 
            phrase1 = self.content_words[i]
            for j in range(n): 
                if j != i:
                    phrase2 = self.content_words[j]: 
    
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

    rake = RakeKeywordExtractor()
    rake.setText('This is a example text document for analysis using the rake class')
    rake.stopWords()