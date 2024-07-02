import Part from './Part';
import { CoursePart } from '../types';


interface ContentProps {
  parts: CoursePart[];
}

const Content = (props: ContentProps) => {
  return(
    <div>
      {props.parts.map((part, index) => (
        <Part key={index} {...part} />
      ))}
    </div>
  );
};

export default Content