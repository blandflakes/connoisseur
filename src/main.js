import { defaultPersonas, defaultSubjects, getCorpusText } from 'src/corpora';
import { trainGenerator } from 'src/generator';
import React from 'react';
import ReactDOM from 'react-dom';

var CorpusUploader = React.createClass({
  getInitialState: function() {
    return { name: "", text: "", type: "persona" };
  },
  updateCorpusName: function(e) {
    this.setState({ name: e.target.value });
  },
  updateCorpusText: function(e) {
    this.setState({ text: e.target.value });
  },
  updateCorpusType: function(e) {
    this.setState({ type: e.target.value });
  },
  addCorpus: function(e) {
    var name = this.state.name.trim();
    var text = this.state.text.trim();
    var type = this.state.type;
    this.props.newCorpus({ name: name, text: text, type: type });
    this.setState(this.getInitialState());
  },
  render: function() {
    return (
      <div className="corpusUploader right">
        <h4>Add a new corpus</h4>
        <input
          className="corpusName"
          placeholder="corpus name"
          value={this.state.name}
          onChange={this.updateCorpusName}
        />
        <br />
        <textarea
          className="corpusText"
          placeholder="Insert corpus text here!"
          value={this.state.text}
          onChange={this.updateCorpusText}
        />
        <br />
        <input
          type="radio"
          name="corpusType"
          value="persona"
          checked={this.state.type === "persona"}
          onChange={this.updateCorpusType} />
        Persona <br />
        <input
          type="radio"
          name="corpusType"
          value="subject"
          checked={this.state.type === "subject"}
          onChange={this.updateCorpusType} />
        Subject <br />
        <button className="button" type="button" onClick={this.addCorpus}>Add!</button>
      </div>
    );
  }
});

var TrainingParameters = React.createClass({
  getInitialState: function() {
    return {
      selectedPersona: null,
      selectedSubject: null
    };
  },
  someSelected: function() {
    return this.state.selectedPersona && this.state.selectedSubject;
  },
  sameParameters: function() {
    if (this.props.persona && this.props.subject && this.state.selectedPersona
                                           && this.state.selectedSubject) {
      return this.props.persona.name === this.state.selectedPersona.name &&
        this.props.subject.name === this.state.selectedSubject.name;
    }
    return false;
  },
  selectPersona: function(corpus) {
    this.setState({ selectedPersona: corpus });
  },
  selectSubject: function(corpus) {
    this.setState({ selectedSubject: corpus });
  },
  train: function(e) {
    this.props.train({ persona: this.state.selectedPersona,
                       subject: this.state.selectedSubject });
  },
  render: function() {
    var toggleableCorpusNode = function(corpus, isSelected, callback) {
      var classes = "toggleable";
      if (isSelected) {
        classes += " selected";
      }
      return (
        <button className={classes} type="button" onClick={function() { callback(corpus) }}>{corpus.name}</button>
      );
    }.bind(this);

    var personaNodes = this.props.personas.map(function(persona) {
      var selected = this.state.selectedPersona && this.state.selectedPersona.name === persona.name;
      return toggleableCorpusNode(persona, selected, this.selectPersona);
    }.bind(this));
    var subjectNodes = this.props.subjects.map(function(subject) {
      var selected = this.state.selectedSubject && this.state.selectedSubject.name === subject.name;
      return toggleableCorpusNode(subject, selected, this.selectSubject);
    }.bind(this));

    return (
      <div className="trainingParameters left">
        <h4>Training Parameters</h4>
        <div className="personas">
          <h5>Personas</h5>
          {personaNodes}
        </div>
        <div className="subjects">
          <h5>Subjects</h5>
          {subjectNodes}
        </div>
        <button
          className="button"
          type="button"
          disabled={!this.someSelected() || this.sameParameters()}
          onClick={this.train}>
          Train!
        </button>
      </div>
    );
  }
});

var TextDisplay = React.createClass({
  render: function() {
    var headerText = this.props.persona.name + "'s notes on " + this.props.subject.name;
    return (
      <div className="textDisplay bordered">
        <h4>{headerText}</h4>
        <blockquote>{this.props.notes}</blockquote>
        <button class="button" type="button" onClick={this.props.generate}>Generate!</button>
      </div>
    );
  }
});

var Interface = React.createClass({
  getInitialState: function() {
    return {
      personas: defaultPersonas,
      subjects: defaultSubjects,
      persona: null,
      subject: null,
      notes: null,
      generator: null
    };
  },
  newCorpus: function(corpus) {
    var newCorpus = {
      name: corpus.name,
      text: corpus.text,
      location: "local"
    };
    if (corpus.type === "persona") {
      this.setState({ personas: this.state.personas.concat([newCorpus]) });
    }
    else {
      this.setState({ subjects: this.state.subjects.concat([newCorpus]) });
    }
  },
  train: function(corpora) {
    Promise.all([getCorpusText(corpora.persona), getCorpusText(corpora.subject)]).then(function(corporaText) {
      var generator = trainGenerator(corporaText);
      var notes = generator.generate();
      this.setState({ persona: corpora.persona, subject: corpora.subject,
                      generator: generator, notes: notes });
    }.bind(this));
  },
  generate: function() {
    var newNotes = this.state.generator.generate();
    this.setState({ notes: newNotes });
  },
  render: function () {
    return (
      <div className="container">
        <h2>Connoisseur: Procedurally Generated Reviews</h2>
        <div className="bordered">
          <TrainingParameters personas={this.state.personas} subjects={this.state.subjects} train={this.train}
          persona={this.state.persona} subject={this.state.subject} />
          <CorpusUploader newCorpus={this.newCorpus} />
        </div>
        { this.state.generator &&
          <TextDisplay persona={this.state.persona} subject={this.state.subject}
            notes={this.state.notes} generate={this.generate} /> }
        <h5>A project by <a href="http://blandflakes.github.io/">blandflakes</a></h5>
      </div>
    );
  }
});

ReactDOM.render(
  <Interface />,
  document.getElementById('outer')
);
