import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import PageContent from "../../components/Layout/PageContent";
import PageNotFound from "../../components/PageNotFound";
import PracticeContainer from "../../components/Practice/PracticeContainer";
import SidePanel from "../../components/SidePanel/SidePanel";
import { ProblemType } from "../../enums/problems";

const ProblemPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [problemType, setProblemType] = useState<ProblemType>();
  const [problemTypeValid, setProblemTypeValid] = useState(false);
  const router = useRouter();

  const validSkills = [
    ProblemType.ADD_SUBTRACT,
    ProblemType.MULTIPLY_DIVIDE,
    ProblemType.PERCENTAGES,
    ProblemType.MASHUP,
  ];

  const checkValidSkill = (problemType: ProblemType) => {
    const isValid = validSkills.includes(problemType);

    if (isValid) {
      setProblemType(problemType);
    }
    setProblemTypeValid(isValid);
  };

  useEffect(() => {
    const { type } = router.query;
    if (type) {
      checkValidSkill(type as ProblemType);
    }
  }, [router.query]);

  return (
    <>
      {!problemTypeValid ? (
        <PageNotFound message="Sorry, the page you requested can't be found." />
      ) : (
        <PageContent>
          <>
            <PracticeContainer problemType={problemType!} />
          </>
          <>
            <SidePanel />
          </>
        </PageContent>
      )}
    </>
  );
};
export default ProblemPage;
