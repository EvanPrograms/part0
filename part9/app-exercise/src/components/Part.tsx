import { CoursePart } from '../types';

const Part = (props: CoursePart) => {
  switch (props.kind) {
    case "basic":
      return (
        <div>
          <h3>{props.name} {props.exerciseCount}</h3>
          <p><em>Description: {props.description}</em></p>
        </div>
      );
    case "group":
      return (
        <div>
          <h3>{props.name} {props.exerciseCount}</h3>
          <p>Group Projects: {props.groupProjectCount}</p>
        </div>
      );
    case "background":
      return (
        <div>
          <h3>{props.name} {props.exerciseCount}</h3>
          <p><em>Description: {props.description}</em></p>
          <p>Background Material: <a href={props.backgroundMaterial}>{props.backgroundMaterial}</a></p>
        </div>
      );
    case "special":
      return (
        <div>
          <h3>{props.name} {props.exerciseCount}</h3>
          <p><em>Description: {props.description}</em></p>
          <p>required skills: {props.requirements.join(', ')}</p>
        </div>
      );
    default:
      return null;
  }
};

export default Part;