import sys 
import getopt
import numpy as np
from nltk.corpus import stopwords 
from nltk.tokenize import word_tokenize
from nltk.probability import FreqDist
from nltk.collocations import *
import nltk
import random 

if __name__ == "__main__": 

    class RakeKeywordExtractor: 
        def __init__(self, text = None, options = None): 
            if text is None: 
                print("Error: text is not set")
            else: 
                # Stores the source text 
                self.text = text.lower()
                # Stores the user-defined options 
                self.options = options
                # Stores the list of stopwords
                self.stopwords = [] 
                # Stores the list of content words
                self.content_words = [] 
                # Stores the sentences in the text 
                self.sentences = [] 
                # Stores the candidate phrases generated
                self.phrases = []
                # Stores the final scores
                self.scores = [] 
                # Stores the ngrams in the candidate phrase 
                self.bigrams = []

        # Sets the stopwords present in the text               
        def _set_Stopwords(self): 
            stop_words = set(stopwords.words('english'))
            word_tokens = word_tokenize(self.text)
            if len(word_tokens) > 0: 
                self.stopwords = [w for w in word_tokens if w in stop_words]

        # Sets the content words present in the text
        def _set_Contentwords(self): 
            if len(self.stopwords) == 0: 
                self._set_Stopwords()
            word_tokens = word_tokenize(self.text)
            self.content_words = set([w for w in word_tokens if w not in self.stopwords and not self._isPunct(w)])

        # Sets the sentences in the text. Usually only 1
        def _set_Sentences(self): 
            self.sentences = nltk.sent_tokenize(self.text)
       
        # Checks if a string is a punct or not
        def _isPunct(self, x = None): 
            return not x.isalnum()

        # Generates the candidate expression which is split by stopwords
        def _generate_Candidate_Expression(self): 
            for sentence in self.sentences: 
                phrase = []
                for word in word_tokenize(sentence): 
                    if word in self.stopwords or self._isPunct(word):
                        if len(phrase) > 0: 
                            self.phrases.append(phrase)
                            phrase = [] 
                    else: 
                        phrase.append(word)     
            print(self.phrases)                 

        # Gets the bigrams in the phrases  
        def getBigrams(self): 
            bigram_measure = nltk.collocations.BigramAssocMeasures()
            for phrase in self.phrases: 
                if len(phrase) > 1: 
                    finder = BigramCollocationFinder.from_words(phrase)
                    ngrams = finder.score_ngrams(bigram_measure.raw_freq) 
                    for ngram, score in ngrams: 
                        if len([el for el in self.bigrams if el['ngram'] == " ".join(ngram)]) == 0: 
                            self.bigrams.append({
                                'ngram': " ".join(ngram), 
                                'count': 1
                            })
                        else: 
                            for bigram in self.bigrams: 
                                if bigram['ngram'] == " ".join(ngram): 
                                    bigram['count'] += 1
                else: 
                    continue
        
        def _calculate_Scores(self):
            word_tokens = word_tokenize(self.text)
            # Calculate the frequency 
            fdist_freq = FreqDist(word_tokens)

                    
    # Get the arguments 
    argv = sys.argv[1:] 
    # Parse the argument vector 
    try: 
        opts, args = getopt.getopt(argv, "t:", ["text="])
    except getopt.GetoptError as err: 
        print("usage: -t <sometext> OR --text=<sometext>")
    for opt, arg in opts: 
        if opt in ['-t', '--text']: 
            if len(arg) > 10: 
                sourceText = arg
            else: 
                print("error: text too small!")
                sourceText = ''

    rake = RakeKeywordExtractor(sourceText, { 'getBigrams': False })
    rake._set_Stopwords()
    rake._set_Contentwords()
    rake._set_Sentences()
    rake._generate_Candidate_Expression()
    rake._calculate_Scores()
else: 
    print('Error: Run as main')



    