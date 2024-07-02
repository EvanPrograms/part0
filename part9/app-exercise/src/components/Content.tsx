interface CoursePart {
  name: string;
  exerciseCount: number;
}

interface ContentProps {
  parts: CoursePart[];
}

const Content = (props: ContentProps) => {
  return(
    <div>
      {props.parts.map((part, index) => (
        <p key={index}>
          {part.name} {part.exerciseCount}
        </p>
      ))}
    </div>
  );
};

export default Content