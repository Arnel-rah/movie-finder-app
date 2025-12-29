interface ArticlesProps {
  name: string;
  age: number;
}

const Articles: React.FC<ArticlesProps> = ({ name, age }) => {
  return (
    <div>
      <p>Name: {name}</p>
      <p>Age: {age}</p>
    </div>
  );
};

export default Articles;
