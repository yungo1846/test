import React, { Component } from 'react'
import Header from './Header'
import Calendar from './Calendar'
import delete_img from './style/delete.png';
import logo_img from './style/vision_ic.png';

import moment from 'moment'

import './style/RCA.css'

export default class App extends Component {
    
    state = {
        calendarYM : moment(),
        today : moment(),
        selected: moment().format("YYYY-MM-DD"),
        title: "",
        end_date: "",
        description: "",
        id: 2, // 배포 시 schdule 리스트 비우고 id도 0으로 초기화 필요
        company: ["삼산텍", "풀무원", "토스", "IBM", "삼성SDS"],
        selectedCompany: "default",
        schedule: [{ id: 0, title: "삼산텍 버그픽스", company: "삼산텍", date: "2020-11-27", end_date:"2020-11-30", description: "오후 5시까지 담당자 만날 것" }, { id: 1, title: "react 개발", company: "토스", date: "2020-11-27", description: "react hook 공부" }],
        company_clicked: "전체",
        del_clicked: false,
        plus_clicked: true,
        new_company: "",
    }

    static defaultProps = {
        clickFn : ()=>{}
    }

    moveMonth = (month) => {
        this.setState({
            calendarYM : this.state.calendarYM.add(month,'M')
        })
    }

    changeSelected = (clickedDate) =>{

        if(moment(clickedDate).isSame(this.state.selected,'day')){
            this.props.clickFn(clickedDate);
            return;
        }

        this.setState({
            selected : clickedDate
        })

        this.props.clickFn(clickedDate)
        
        if(moment(clickedDate).isBefore(this.state.calendarYM,'month')){
            this.moveMonth(-1)
        }else if(moment(clickedDate).isAfter(this.state.calendarYM,'month')){
            this.moveMonth(1)
        }
    }

    submit = (e) => {
        e.preventDefault()
        if (this.state.selectedCompany !== "default") {
            var delete_or_not = window.confirm('\''+this.state.selectedCompany+'\'' + '을(를) 정말로 삭제 하시겠습니까?')
            if (delete_or_not) {
                this.handleCompanyDelete();
            } else {
                alert("취소 되었습니다.");
            }
        }
      };

    handleCompanyClicked = (e) => {
        this.setState({
          company_clicked: e.target.id,
        }, () => console.log(this.state.company_clicked))
      }
      
    handleCompanyDelete = () => {
        this.setState({
            company: this.state.company.filter(company => company !== this.state.selectedCompany),
            schedule: this.state.schedule.filter(schedule => schedule.company !== this.state.selectedCompany)
        }, () => { console.log(this.state.company, this.state.schedule) })
    }
    
    companyChange = (event) => {
    this.setState({
        new_company: event.target.value,
    })
    }

    handleCompanySubmit = (event) => {
    event.preventDefault()
    if (this.state.new_company !== "") {
        this.setState({
        company: this.state.company.concat(this.state.new_company),
        new_company: "",
    }) 
    }
    event.target.reset()
    }

    titleChange = (e) => {
        this.setState({
            title: e.target.value,
        })
    }

    endDateChange = (e) => {
        this.setState({
            end_date: e.target.value,
        })
    }

    descriptionChange = (e) => {
        this.setState({
            description: e.target.value,
        })
    }

    handleSubmit = (event) => {
        event.preventDefault()
        const { schedule, id, title, selectedCompany, description, end_date, selected } = this.state;
        const endDate = moment(end_date);
        const startDate = moment(selected);
        var diff = endDate.diff(startDate, 'days');
        var count;
        var new_schedule = [];
        for (count = 0; count <= diff; count++){
            new_schedule.push({id: id, title: title, company: selectedCompany, date: startDate.clone().add(count, 'days').format("YYYY-MM-DD"), end_date: end_date, description: description})
        }
        console.log(new_schedule, count, diff)
        this.setState({
            schedule: schedule.concat(new_schedule),
            id: id + 1,
        }, () => console.log(this.state))
        event.target.reset()
    }

    deleteSchedule = (e,id) => {
        this.setState({
            schedule: this.state.schedule.filter(schedule => schedule.id !== id)
        })
        console.log(id);
    }

    handleSelect = (e) => {
        this.setState({
            selectedCompany: e.target.value
        })
    }
    
    render() {
        return (
            <div>
            <div className="entire flex justify-between items-center">
            <div className="bg-white w-1/6 input_box flex flex-col">
                <img src={logo_img} className="w-32 mt-5 ml-2"></img>
          <div className="flex-1 ml-2 mt-5">
                            <div className="font-bold text-xl mb-3">회사별 일정</div>
                            <div className="flex flex-row flex-wrap">
                            <div className={"cursor-pointer border rounded-lg text-center bg-gray-300 w-5/12 h-10 text-base font-medium pt-1 mx-2 my-2 "+(this.state.company_clicked==="전체" ? 'btn_clicked' : '')} id="전체" onClick={this.handleCompanyClicked}>전체</div>
            {this.state.company.map((company, i) => {
              return(
                  <div className={"cursor-pointer border rounded-lg text-center bg-gray-300 w-5/12 h-10 text-base font-medium pt-1 mx-2 my-2 "+(this.state.company_clicked===company ? 'btn_clicked' : '')} id={company} onClick={this.handleCompanyClicked}>{company}</div>)
            })}
                        </div>
                            </div>
                        <div className="flex-1">
          <div className="ml-2 mt-5">
          <div className="font-bold btn text-xl">회사 추가</div>
          <form onSubmit={this.handleCompanySubmit}>
            <div className="flex flex-row">
                            <input className="border border-black mt-2 w-4/6" type="text" id="new_company" value={this.new_company} onChange={this.companyChange}></input>
                        <button className="border rounded-md w-16 font-bold text-base mt-2 ml-3 float-right text-center text-white bg-blue-700">
                                    저장
                        </button>
                        </div>
                        </form>
          </div>
          <div className="ml-2 mt-5">
                            <span className="font-bold btn text-xl">회사 삭제</span>
                            <div className="flex flex-row"><form onSubmit={this.submit}><select name="del_company" className="mt-2 text-base border border-black" size="1" onChange={this.handleSelect}>
                            <option value="default">회사를 선택하세요.</option>
                                {this.state.company.map((company, i)=>{
                                    return(
                                        <option value={company}>{company}</option>
                                    )
                                })}
                            </select>
                            <button className="border rounded-md w-16 font-bold text-base mt-2 ml-3 float-right text-center text-white bg-red-700">
                            삭제
                </button></form></div>
                            </div>
                            </div>
        </div>
                <div className="test-layout flex justify-center">
                    <div className="RCA-app-container bg-white rounded-md">
                        <Header calendarYM={this.state.calendarYM.format("YYYY년 MM월")}
                            today={this.state.today.format("오늘 YYYY - MM - DD")}
                            moveMonth={this.moveMonth}
                            />
                            {this.state.company_clicked === "전체" ? <Calendar YM={this.state.calendarYM.format("YYYY-MM-DD")}
                            selected={this.state.selected}
                            changeSelected={this.changeSelected}
                            schedule={this.state.schedule}
                        /> : <Calendar YM={this.state.calendarYM.format("YYYY-MM-DD")}
                        selected={this.state.selected}
                        changeSelected={this.changeSelected}
                        schedule={this.state.schedule.filter(schedule => schedule.company === this.state.company_clicked)}
                    /> }
                    </div>
                </div>
                <div className="small_input_box rounded-l-md w-1/5 flex flex-col bg-white">
                    <div className="flex-1">
                    <div className="mt-5 font-bold text-xl text-center">
                        {this.state.selected}
                    </div>
                    <div className="mt-5 mb-2 ml-5 font-bold text-base">
                        일정
                    </div>
                    <div>
                    {this.state.schedule.filter(schedule => (schedule.company===this.state.company_clicked) || this.state.company_clicked === "전체").map((info, i) => {
                    if (this.state.selected === info.date) {
                        return (
                            <div className="break-all ml-5 text-sm font-bold">
                                <div className="flex flex-row">- {info.title}
                                    <button id={info.id} onClick={(e) =>this.deleteSchedule(e,info.id) }>
                                        <img src={delete_img} className="mx-2 w-4 h-4"></img>
                                        </button>
                                    </div>
                                <div className="break-all ml-2 mb-px font-medium">: {info.description}</div>
                            </div>)
                    }
                    })}
                        </div>
                        </div>
                    <div className="flex-1">
                        <form onSubmit={this.handleSubmit}>
                        <div className="font-bold ml-5 text-base">일정추가</div>
                        <div className="mt-2 ml-5 font-bold text-sm">
                        * 제목
                        </div>
                            <input className="border border-black mt-2 ml-5 w-5/6 h-6" type="text" id="title" value={this.title} onChange={this.titleChange} required></input>
                            <div className="mt-3 ml-5 font-bold text-sm">
                                * 회사
                        </div>
                                <select name="company" className="mt-2 ml-5 text-sm border border-black" size="1" onChange={this.handleSelect} required>
                                <option value="">회사를 선택하세요.</option>
                                {this.state.company.map((company, i)=>{
                                    return(
                                        <option value={company}>{company}</option>
                                    )
                                })}
                                </select>
                        <div className="mt-3 ml-5 font-bold text-sm">
                                    * 종료 날짜
                        </div>
                                <input className="mt-2 ml-5 text-sm" type="date" id="date" value={this.end_date} onChange={this.endDateChange} required></input>
                        <div className="mt-3 ml-5 font-bold text-sm">
                            * 설명
                        </div>
                        <textarea className="border border-black mt-2 ml-5 w-5/6" rows="2" id="description" value={this.description} onChange={this.descriptionChange}></textarea>
                        <br></br>
                        <button className="border rounded-md w-16 font-bold text-sm my-2 mr-5 float-right text-center text-white bg-blue-700">
                                    저장
                        </button>
                        </form>
                    </div>
                </div>
            </div>
         </div>
        )
    }
}
