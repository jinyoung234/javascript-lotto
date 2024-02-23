/**
 * @module WinningRank
 * 로또 번호와 당첨 번호 및 보너스 번호를 비교하여 당첨 등수를 계산하는 역할의 모듈
 */
class WinningRank {
  /**
   * @type {import("../../types/jsDoc").RankRule}
   */
  static RANK_RULE = {
    '1st': { match: 6, hasBonus: false, description: '6개 일치' },
    '2nd': { match: 5, hasBonus: true, description: '5개 일치, 보너스 볼 일치' },
    '3rd': { match: 5, hasBonus: false, description: '5개 일치' },
    '4th': { match: 4, hasBonus: false, description: '4개 일치' },
    '5th': { match: 3, hasBonus: false, description: '3개 일치' },
  };

  #lottoDrawDetail;

  /**
   * @type {import("../../types/jsDoc").WinningRankResult}
   */
  #winningRankResult = {
    '1st': 0,
    '2nd': 0,
    '3rd': 0,
    '4th': 0,
    '5th': 0,
  };

  /**
   * @param {import("../../types/jsDoc").LottoDrawDetail} lottoDrawDetail - 당첨 번호, 보너스 번호, 로또 번호의 속성으로 이루어진 객체
   */
  constructor({ winningNumber, lottoNumbers, bonusNumber }) {
    this.#lottoDrawDetail = { winningNumber, lottoNumbers, bonusNumber };
  }

  /**
   * @returns {import("../../types/jsDoc").WinningRankResult} - 1 ~ 5등의 당첨 횟수가 담긴 객체
   */
  calculateRank() {
    return this.#lottoDrawDetail.lottoNumbers.reduce((prevWinningRankDetail, lottoNumber) => {
      const rank = this.#determineRank(lottoNumber);

      return rank !== null
        ? { ...prevWinningRankDetail, [rank]: prevWinningRankDetail[rank] + 1 }
        : prevWinningRankDetail;
    }, this.#winningRankResult);
  }

  /**
   * @param {import("../../types/jsDoc").LottoNumber} lottoNumber - 로또 번호
   * @returns {import("../../types/jsDoc").Rank | null} 등수 정보 또는 null
   */
  #determineRank(lottoNumber) {
    const matchCount = this.#countMatchingNumbers(lottoNumber);
    const targetRankRule = Object.entries(WinningRank.RANK_RULE).find(
      ([, { match, hasBonus }]) =>
        matchCount === match && this.#isIncludingBonusNumber(lottoNumber) === hasBonus,
    );

    const rank = targetRankRule ? targetRankRule[0] : null;
    return rank;
  }

  /**
   * @param {import("../../types/jsDoc").LottoNumber} lottoNumber - 로또 번호
   * @returns {number} 로또 번호에 당첨 번호 일치 갯수
   */
  #countMatchingNumbers(lottoNumber) {
    const winningNumberSet = new Set(this.#lottoDrawDetail.winningNumber);

    return lottoNumber.reduce(
      (count, number) => (winningNumberSet.has(number) ? count + 1 : count),
      0,
    );
  }

  /**
   * @param {import("../../types/jsDoc").LottoNumber} lottoNumber - 로또 번호
   * @returns {boolean} 로또 번호에 보너스 번호 포함 여부
   */
  #isIncludingBonusNumber(lottoNumber) {
    return lottoNumber.includes(this.#lottoDrawDetail.bonusNumber);
  }
}

export default WinningRank;
