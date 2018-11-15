import ora from 'ora'
import inquirer from 'inquirer'
import downLoadGit from 'download-git-repo'

let create = async () => {
    let loading = ora('数据拉取中...')
    let answer = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message:'项目名称',
        default:'hwui-cli'
      },
      {
        type: 'list',
        name: 'projectType',
        message: '项目模板',
        choices: ['前端组件UI', '后端管理界面（admin框架））'],
        default: '前端组件UI'
      }
    ])

    let project = answer.projectName
    let templateName = answer.projectType === '前端组件UI' ? 'fzl18/hwui-ui' : 'fzl18/hwui-admin'
    loading.start()

    downLoadGit(templateName, process.cwd() + '/' + project, (err) => {  
      if (err) {
        console.log(err)
        return
      }
      console.log(process.cwd()+'/'+project)
      loading.succeed()
      console.log('')
      console.log('数据拉取成功！')
      console.log('')
      console.log('请使用以下命令启动项目：')
      console.group('')
      console.log(`cd ${project}`)
      console.log('npm install')
      console.log('npm run dev')
    })
}

export default create
