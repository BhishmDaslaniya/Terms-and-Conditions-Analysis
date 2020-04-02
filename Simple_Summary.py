from __future__ import absolute_import
from __future__ import division, print_function, unicode_literals

from sumy.parsers.html import HtmlParser
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lsa import LsaSummarizer as Summarizer
from sumy.nlp.stemmers import Stemmer
from sumy.utils import get_stop_words

def urlDoc_summarize(url):
    parser = HtmlParser.from_url(url, Tokenizer('english'))
    stemmer = Stemmer('english')
    summarizer = Summarizer(stemmer)
    summarizer.stop_words = get_stop_words('english')
    summary = ''
    for sentense in summarizer(parser.document,15):
        summary+=str(sentense) + ' '
    return summary

def plainText_summarize(text):
    parser = PlaintextParser.from_string(text,Tokenizer('english'))
    stemmer = Stemmer('english')
    summarizer = Summarizer(stemmer)
    summarizer.stop_words = get_stop_words('english')
    summary = ''
    for sentense in summarizer(parser.document,15):
        summary+=str(sentense) + ' '
    return summary
