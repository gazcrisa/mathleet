import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import PageContent from "../../components/Layout/PageContent";
import PageNotFound from "../../components/PageNotFound";
import PracticeContainer from "../../components/Practice/PracticeContainer";
import SidePanel from "../../components/SidePanel/SidePanel";
import TopSlider from "../../components/TopSlider/TopSlider";
import { ProblemType } from "../../enums/problems";

const ProblemPage: React.FC = () => {
  const [problemType, setProblemType] = useState<ProblemType>();
  const [problemTypeValid, setProblemTypeValid] = useState(false);
  const [width, setWidth] = useState(0);
  const carousel = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const ref = carousel.current;
    if (ref) {
      setWidth(ref.scrollWidth - ref.offsetWidth);
    }
  }, [carousel, checkValidSkill]);

  return (
    <>
      {!problemTypeValid ? (
        <PageNotFound message="Sorry, the page you requested can't be found." />
      ) : (
        <PageContent>
          <>
            <Flex
              ref={carousel}
              p={2}
              cursor="grab"
              overflow="hidden"
              display={{ md: "none" }}
              mb={1}
            >
              <TopSlider width={width} />
            </Flex>
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
