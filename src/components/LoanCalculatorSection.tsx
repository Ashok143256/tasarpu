'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Calculator, DollarSign, TrendingUp, Calendar, Info } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export function LoanCalculatorSection() {
  const { t } = useLanguage()
  const [loanAmount, setLoanAmount] = useState('')
  const [interestRate, setInterestRate] = useState('10')
  const [loanTerm, setLoanTerm] = useState('12')
  const [result, setResult] = useState<{
    monthlyPayment: number
    totalPayment: number
    totalInterest: number
  } | null>(null)

  const calculateLoan = () => {
    const principal = parseFloat(loanAmount)
    const rate = parseFloat(interestRate) / 100 / 12 // Monthly interest rate
    const term = parseInt(loanTerm)

    if (isNaN(principal) || isNaN(rate) || isNaN(term) || principal <= 0 || term <= 0) {
      return
    }

    // Calculate monthly payment using amortization formula
    const monthlyPayment = principal * (rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1)
    const totalPayment = monthlyPayment * term
    const totalInterest = totalPayment - principal

    setResult({
      monthlyPayment,
      totalPayment,
      totalInterest
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ne-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const quickExamples = [
    { amount: '50000', rate: '10', term: '12', label: 'Small Equipment Loan' },
    { amount: '100000', rate: '8', term: '24', label: 'Crop Cultivation' },
    { amount: '200000', rate: '9', term: '36', label: 'Land Development' }
  ]

  return (
    <section id="calculator" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Calculator className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              {t('calculator.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Calculate your agricultural loan payments with our easy-to-use amortization calculator. 
              Get instant estimates for monthly payments and total interest.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calculator Form */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="h-6 w-6 text-green-600" />
                  <span>Loan Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="loanAmount">{t('calculator.loan.amount')} (NPR)</Label>
                  <Input
                    id="loanAmount"
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    placeholder="Enter loan amount"
                    min="1000"
                    step="1000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interestRate">{t('calculator.interest.rate')}</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    placeholder="Annual interest rate"
                    min="1"
                    max="30"
                    step="0.1"
                  />
                  <p className="text-sm text-gray-500">
                    Our cooperative offers competitive rates between 8-12% annually
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loanTerm">{t('calculator.loan.term')}</Label>
                  <Input
                    id="loanTerm"
                    type="number"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(e.target.value)}
                    placeholder="Loan term in months"
                    min="1"
                    max="120"
                    step="1"
                  />
                  <p className="text-sm text-gray-500">
                    Typical loan terms range from 12 to 60 months
                  </p>
                </div>

                <Button 
                  onClick={calculateLoan}
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  {t('calculator.calculate')}
                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            <div className="space-y-6">
              {result ? (
                <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
                  <CardHeader>
                    <CardTitle className="text-green-800">Calculation Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="bg-white p-4 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-5 w-5 text-green-600" />
                            <span className="font-medium">{t('calculator.monthly.payment')}</span>
                          </div>
                          <div className="text-xl font-bold text-green-600">
                            {formatCurrency(result.monthlyPayment)}
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-5 w-5 text-blue-600" />
                            <span className="font-medium">{t('calculator.total.payment')}</span>
                          </div>
                          <div className="text-xl font-bold text-blue-600">
                            {formatCurrency(result.totalPayment)}
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg border border-orange-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="h-5 w-5 text-orange-600" />
                            <span className="font-medium">{t('calculator.total.interest')}</span>
                          </div>
                          <div className="text-xl font-bold text-orange-600">
                            {formatCurrency(result.totalInterest)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div className="text-sm text-blue-800">
                          <p className="font-semibold mb-1">Note:</p>
                          <p>This is an estimate only. Actual loan terms may vary based on credit assessment and cooperative policies.</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <Calculator className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Enter loan details and click calculate to see your payment estimates
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Quick Examples */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Examples</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {quickExamples.map((example, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start h-auto p-3"
                      onClick={() => {
                        setLoanAmount(example.amount)
                        setInterestRate(example.rate)
                        setLoanTerm(example.term)
                      }}
                    >
                      <div className="text-left">
                        <div className="font-medium">{example.label}</div>
                        <div className="text-sm text-gray-500">
                          NPR {parseInt(example.amount).toLocaleString()} @ {example.rate}% for {example.term} months
                        </div>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">8-12%</div>
                <div className="text-gray-700 font-medium">Interest Rate Range</div>
                <div className="text-sm text-gray-500 mt-1">Competitive rates for farmers</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">3-5 days</div>
                <div className="text-gray-700 font-medium">Processing Time</div>
                <div className="text-sm text-gray-500 mt-1">Quick loan approval</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">₹10K - ₹5L</div>
                <div className="text-gray-700 font-medium">Loan Amount Range</div>
                <div className="text-sm text-gray-500 mt-1">Flexible amounts available</div>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Apply for a Loan?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Visit our office or contact us to learn more about our agricultural loan programs 
                and start your application process today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Contact Us
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-green-600 text-green-600 hover:bg-green-50"
                  onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}