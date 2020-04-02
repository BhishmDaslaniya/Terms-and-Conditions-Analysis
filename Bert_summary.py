import pickle

filename = 'finalized_model.sav'
loaded_model = pickle.load(open(filename, 'rb'))

def make_summary(text):
    return(loaded_model(text,min_length=150))
