# COVID-19 Korea Mask Store Map
![Deploy to GitHub Pages](https://github.com/taeukme/covid-19-mask-map/workflows/Deploy%20to%20GitHub%20Pages/badge.svg?branch=master)

COVID-19 Korea Mask Store Map provides near real-time (within 5 minutes) information of public mask stores' location and stock, utilizing the open API provided by [National Information Society Agency](https://eng.nia.or.kr/site/nia_eng/main.do) and [Health Insurance Review and Assessment Service](https://www.hira.or.kr/eng/main.do) of the Republic of Korea.

The project is a part of [LiveCorona Map](https://github.com/LiveCoronaDetector/livecod) and is also embedded in [CoronaNow](https://coronanow.kr).

코로나19 공적 마스크 판매처 지도는 판매처의 위치 및 재고를 확인하여 보여주는 웹 앱입니다. [한국정보화진흥원](https://www.nia.or.kr/site/nia_kor/main.do)과 [건강보험심사평가원](https://www.hira.or.kr/main.do)이 제공하는 API를 기반으로 운영됩니다.

[라이브코로나 맵](https://github.com/LiveCoronaDetector/livecod) 프로젝트에 소속되어 있으며 [코로나나우](https://coronanow.kr)에도 삽입되어 있습니다.

## Service shutdown
As mask stocks have stabilized, the public mask program will stop on July 12th. Masks can be purchased from pharmacies, supermarkets, online, and convenience stores without limitations. As a result, the mask map service will also shut down. Thank you.

The repository will remain here after shutdown and the app may be redeployed when public mask program resumes.

마스크 공급이 안정화되어 7월 12일부터 공적 마스크 공급을 중단합니다. 12일부터 약국, 마트, 편의점, 온라인에서 제한 없이 구매가 가능합니다. 이에 따라 마스크 맵 서비스도 운영을 중단합니다. 공적 마스크 관련 소식은 식약처 [보도자료](https://www.mfds.go.kr/brd/m_99/view.do?seq=44393)를 참고해 주십시오. 이용해 주셔서 감사합니다.

서비스 종료 후에도 본 저장소는 유지되며 공적 마스크 공급이 재개될 경우 서비스가 재가동될 수 있습니다.

## Tech Stack
- JavaScript using React
  - Naver Maps API
  - Bootstrap
- Built on GitHub Actions
- Deployed on GitHub Pages

## Localization
The web app is localized in three languages: Korean, English, and Simplified Chinese. To add your language, please fork the repository, [create a localization file](https://github.com/taeukme/covid-19-mask-map/tree/master/public/locales), and submit a pull request.

본 웹 앱은 한국어, 영어, 중국어(간체)로 번역되어 있습니다. 언어를 번역하시려면 저장소를 포크하시고 [번역 파일](https://github.com/taeukme/covid-19-mask-map/tree/master/public/locales)을 생성하신 후 Pull Request를 생성하십시오.

## License
[MIT](https://github.com/taeukme/covid-19-mask-map/blob/master/LICENCE.md)