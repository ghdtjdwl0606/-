
import { TestType } from './types';

export const TEMPLATES: Record<TestType, string> = {
  EPT: `안녕하세요.

{name} 학생 25년 겨울학기 정기평가고사 결과,
EPT (R+L+S+W) : {score} 점

이며, 다음학기 "{assignedClass}"으로 배정 되었습니다.
[봄학기 시작 : 3/2(월)~]

상담을 원하시는 학부모님께서는 언제든지 카카오 메세지를 남겨주시거나, 원으로 전화주세요. 감사합니다.

[ 정기평가고사 점수확인 방법 가이드 ]
http://pf.kakao.com/_QPixoK/97332698

[새 학기 교재 구매 방법 가이드]
http://pf.kakao.com/_QPixoK/97484527`,

  TOEFL_JR: `안녕하세요.

{name} 학생 25년 겨울학기 정기평가고사 결과,

TOEFL Jr. (R+L) : {score}점
TOEFL Jr. (S+W) : {score2}점
 
이며, 다음학기 "{assignedClass}"으로 배정 되었습니다. 
[봄학기 시작 : 3/2(월)~]

상담을 원하시는 학부모님께서는 언제든지 카카오 메세지를 남겨주시거나, 원으로 전화주세요. 감사합니다.

[ 정기평가고사 점수확인 방법 가이드 ]
http://pf.kakao.com/_QPixoK/97332698

[새 학기 교재 구매 방법 가이드]
http://pf.kakao.com/_QPixoK/97484527`,

  TOEFL: `안녕하세요.

{name} 학생 25년 겨울학기 정기평가고사 결과,

iBT TOEFL (R+L+S+W) : {score}점

이며, 다음학기 "{assignedClass}" 으로 배정 되었습니다. 
[봄학기 시작 : 3/2(월)~]

상담을 원하시는 학부모님께서는 언제든지 카카오 메세지를 남겨주시거나, 원으로 전화주세요. 감사합니다.

[ 정기평가고사 점수확인 방법 가이드 ]
http://pf.kakao.com/_QPixoK/97332698

[새 학기 교재 구매 방법 가이드]
http://pf.kakao.com/_QPixoK/97484527`,

  TO: `{name} 학생 TO 시험 결과,

독해: {score} 점
문법: {score2} 점`
};
