import $ from 'jquery';
import { default_personas, default_subjects } from 'src/corpora';
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
    this.setState({ name: "", text: "", type: "persona" });
  },
  render: function() {
    return (
      <div className="corpusUploader right">
        <h4>Add a new corpus</h4>
        <input
          className="corpusName"
          placeholder="Corpus name"
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
      trained_persona: null,
      trained_subject: null,
      selected_persona: null,
      selected_subject: null,
    };
  },
  someSelected: function() {
    return this.state.selected_persona && this.state.selected_subject;
  },
  sameParameters: function() {
    if (this.state.trained_persona && this.state.trained_subject && this.state.selected_persona &&
        this.state.selected_subject) {
      return this.state.trained_persona.name === this.state.selected_persona.name &&
        this.state.trained_subject.name == this.state.selected_subject.name;
    }
    return false;
  },
  selectPersona: function(corpus) {
    this.setState({ selected_persona: corpus });
  },
  selectSubject: function(corpus) {
    this.setState({ selected_subject: corpus });
  },
  train: function(e) {
    this.props.train({ persona: this.state.selected_persona,
                       subject: this.state.selected_subject });
    this.setState({ trained_persona: this.state.selected_persona,
                    trained_subject: this.state.selected_subject });
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

    var personaNodes = this.props.corpora.personas.map(function(persona) {
      var selected = this.state.selected_persona && this.state.selected_persona.name === persona.name;
      return toggleableCorpusNode(persona, selected, this.selectPersona);
    }.bind(this));
    var subjectNodes = this.props.corpora.subjects.map(function(subject) {
      var selected = this.state.selected_subject && this.state.selected_subject.name === subject.name;
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
    return (
      <div className="textDisplay bordered">
        <h4>Brian's notes on being a badass</h4>
        <blockquote>Toasted notes of awesomeness.</blockquote>
        <button class="button" type="button">Generate!</button>
      </div>
    );
  }
});

var Interface = React.createClass({
  getInitialState: function() {
    return {
      personas: default_personas,
      subjects: default_subjects
    };
  },
  newCorpus: function(corpus) {
    var newCorpus = {
      name: corpus.name,
      text: corpus.name,
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
    // TODO actually implement
    alert("Training called!");
    window.console.log(JSON.stringify(corpora));
  },
  render: function () {
    return (
      <div className="container">
        <h2>Connoisseur: Procedurally Generated Reviews</h2>
        <div className="bordered">
          <TrainingParameters corpora={this.state} train={this.train} />
          <CorpusUploader newCorpus={this.newCorpus} />
        </div>
        <TextDisplay />
      </div>
    );
  }
});

ReactDOM.render(
  <Interface />,
  document.getElementById('outer')
);
