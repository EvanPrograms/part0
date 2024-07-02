interface TotalProps {
  total: number;
}

const Total = (props: TotalProps) => (
  <div>
    <p>
      Number of exercises {props.total}
    </p>
  </div>
)

export default Total;