from nltk.probability import FreqDist
from nltk.corpus import stopwords 
from nltk.tokenize import word_tokenize
from math import log 
import nltk 

if __name__ == "__main__": 
    class KeywordExtractor: 
        def __init__(self, text = None, options= { 'parsed': False }): 
            if text is None: 
                print('Error: text not defined')
            else: 
                self.text = text
                self.stopwords = [] 
                self.content_words = []
                self.word_dict = []  
                self.scores = []
                self.corpus_len = len(word_tokenize(self.word_dict))
                self.options = options

        def _preprocess(self): 
            if options['parsed'] == False: 
                parsedText = text.lower()
                # Remove all the whitespace
                parsedText = parsedText.strip() 
                # Remove all the apostrophes 
                parsedText = parsedText.replace("'", "")
                self.text = parsedText
            
            
        def _is_Punct(self, word):
            return not word.isalnum()

        def _set_Stopwords(self): 
            stop_words = set(stopwords.words('english'))
            word_tokens = word_tokenize(self.text)
            self.stopwords = [w for w in word_tokens if w in stop_words or self._is_Punct(w)]
            print(self.stopwords)
        
        def _set_Content_Words(self): 
            word_tokens = word_tokenize(self.text)
            self.content_words = [w for w in word_tokens if w not in self.stopwords and not self._is_Punct(w)]
            print(self.content_words)

        def _calculateTF(self): 
            fdist_tf = FreqDist(self.content_words)
            fdist_idf = FreqDist(self.word)
            for word in set(self.content_words): 
                word_tf = fdist_tf.freq(word)
                word_df = fdist_idf(word) 
                word_idf = log(self.corpus_len/(word_df + 1))
                score = word_tf * word_idf 
                scores.append({ 'word': word, 'tf': word_tf, 'idf': word_idf, 'score': score })
        
    
    keyword_ext = KeywordExtractor('Hey, My name is yash and i am from new delhi')
    keyword_ext._set_Stopwords()
    keyword_ext._set_Content_Words()
