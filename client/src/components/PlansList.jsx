import Accordion from 'react-bootstrap/Accordion';
import Plan from './Plan';

const PlansList = (props) => {
  return (
    <>
      <Accordion defaultActiveKey="0">
        {props.plans?.map((plan, i) => {
          return (
            <Accordion.Item eventKey={i} key={i}>
              <Accordion.Header>{plan.planName}</Accordion.Header>
              <Accordion.Body>
                <Plan plan={plan} public={props.public} current={props.current}></Plan>
              </Accordion.Body>
            </Accordion.Item>
          )
        })}
      </Accordion>
    </>
  )
}

export default PlansList;