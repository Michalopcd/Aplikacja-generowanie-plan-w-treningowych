// const LandingPage = () => {
//   return <div>Landing Page</div>;
// };

// export default LandingPage;

import { Button} from "../../ui/Button";
import { Input } from "../../ui/Input";
import { Card } from "../../ui/Card";
import { Container } from "../../ui/Container";
import { Badge } from "../../ui/Badge";
import { SectionTitle } from "../../ui/SectionTitle";
import { Checkbox } from "../../ui/Checkbox";
const LandingPage = () => {
  return (
  <Container>
    <div className="space-y-6 p-6">
      <SectionTitle>
        Generator Planów Treningowych
      </SectionTitle>

      <Badge>
        Nowy plan
      </Badge>
<Checkbox label="Trening aktywny" />
      <Card>
        <div className="space-y-4">
          <Input placeholder="Nazwa treningu" />

          <Button >
            Zapisz plan
          </Button>
        </div>
      </Card>
    </div>
  </Container>
  )
};

export default LandingPage;