
const Course = ({ courses }) => {
    return (
        <div>
            {courses.map(course => (
                <div key={course.id}>
                    <Header course={course.name} />
                    <Content parts={course.parts} />
                    <Total parts={course.parts} />
                </div>
            ))}
        </div>
    )
}
const Header = (props) => {
    console.log(props)
    return (
        <h1>{props.course}</h1>
    )
}

const Part = ({ part }) => {
    return (
        <p>
            {part.name} {part.exercises}
        </p>
    )
}


const Content = ({ parts }) => {
    return (
        <div>
            {parts.map((part, i) => (
                <Part key={i} part={part} />
            ))}
        </div>
    )
}

const Total = ({ parts }) => {
    return (
        <p>
            Total of {parts.reduce((sum, part) => sum + part.exercises, 0)} exercises
        </p>
    )
}

export default Course